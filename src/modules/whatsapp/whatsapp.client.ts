import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { mapToGroupMessage } from "./message.mapper.js";
import { parseCommand } from "../commands/command-parser.js";
import type { MessageRepository } from "../../repositories/message.repository.js";
import type { SummaryRepository } from "../../repositories/summary.repository.js";
import type { SummaryService } from "../../services/summary.service.js";
import type { AnalysisResult } from "../../types/analysis-result.js";

const { Client, LocalAuth } = pkg;

export class WhatsAppClient {
  private client: pkg.Client;

  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly summaryService: SummaryService,
    private readonly summaryRepository: SummaryRepository,
  ) {
    this.client = new Client({
      authStrategy: new LocalAuth(),
    });

    this.registerEvents();
  }

  private registerEvents(): void {
    this.client.on("qr", (qr) => {
      console.log("Escaneie o QR Code abaixo com o WhatsApp:");
      qrcode.generate(qr, { small: true });
    });

    this.client.on("ready", () => {
      console.log("✅ WhatsApp conectado com sucesso!");
    });

    this.client.on("auth_failure", (message) => {
      console.error("❌ Falha na autenticação:", message);
    });

    this.client.on("disconnected", (reason) => {
      console.warn("⚠️ WhatsApp desconectado:", reason);
    });

    this.client.on("message_create", async (message) => {
      const groupMessage = await mapToGroupMessage(message);
      if (!groupMessage) {
        return;
      }

      const isCommand = groupMessage.message.trim().startsWith("/");
      const isBotReply = message.fromMe && !isCommand;

      if (!isCommand && !isBotReply) {
        try {
          await this.messageRepository.save(groupMessage);
          console.log("💾 Mensagem salva:", {
            group: groupMessage.groupName,
            author: groupMessage.authorName,
          });
        } catch (error) {
          console.error("❌ Erro ao salvar mensagem:", error);
        }
      }

      await this.handleCommand(groupMessage);
    });
  }

  private async handleCommand(
    groupMessage: Awaited<ReturnType<typeof mapToGroupMessage>>,
  ): Promise<void> {
    if (!groupMessage) {
      return;
    }

    const command = parseCommand(groupMessage.message);

    if (!command) {
      return;
    }

    if (command.type === "resumo") {
      await this.runAndLog(
        groupMessage,
        command.periodDays,
        (groupId, groupName, since, periodDays) =>
          this.summaryService.summarize(groupId, groupName, since, periodDays),
      );
      return;
    }

    if (command.type === "topicos") {
      await this.runAndLog(groupMessage, 1, (groupId, groupName, since, periodDays) =>
        this.summaryService.extractTopics(groupId, groupName, since, periodDays),
      );
      return;
    }

    if (command.type === "tarefas") {
      await this.runAndLog(groupMessage, 1, (groupId, groupName, since, periodDays) =>
        this.summaryService.extractTasks(groupId, groupName, since, periodDays),
      );
      return;
    }

    if (command.type === "unknown") {
      console.log(
        `⚠️ Comando não reconhecido em ${groupMessage.groupName}: "${groupMessage.message}"`,
      );
    }
  }

  private async runAndLog(
    groupMessage: NonNullable<Awaited<ReturnType<typeof mapToGroupMessage>>>,
    periodDays: number,
    action: (
      groupId: string,
      groupName: string,
      since: Date,
      periodDays: number,
    ) => Promise<AnalysisResult>,
  ): Promise<void> {
    const since = new Date();
    since.setDate(since.getDate() - periodDays);

    try {
      const result = await action(groupMessage.groupId, groupMessage.groupName, since, periodDays);

      await this.summaryRepository.save(groupMessage.groupId, groupMessage.groupName, result);

      console.log("\n========================================");
      console.log(`📋 Resultado (${result.type}) para o grupo: ${groupMessage.groupName}`);
      console.log("========================================");
      console.log(result.content);
      console.log("========================================\n");
      console.log("💾 Resultado salvo no banco");
    } catch (error) {
      console.error("❌ Erro ao processar comando:", error);
    }
  }

  public async initialize(): Promise<void> {
    await this.client.initialize();
  }
}