import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { mapToGroupMessage } from "./message.mapper.js";
import { parseCommand } from "../commands/command-parser.js";
import type { MessageRepository } from "../../repositories/message.repository.js";
import type { SummaryService } from "../../services/summary.service.js";

const { Client, LocalAuth } = pkg;

export class WhatsAppClient {
    private client: pkg.Client;

    constructor(
        private readonly messageRepository: MessageRepository,
        private readonly summaryService: SummaryService,
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

            await this.handleCommand(groupMessage, message);
        });
    }

    private async handleCommand(
        groupMessage: Awaited<ReturnType<typeof mapToGroupMessage>>,
        rawMessage: pkg.Message,
    ): Promise<void> {
        if (!groupMessage) {
            return;
        }

        console.log("🔍 Texto recebido para parse:", JSON.stringify(groupMessage.message));

        const command = parseCommand(groupMessage.message);

        console.log("🔍 Comando interpretado:", command);

        if (!command) {
            return;
        }

        if (command.type === "resumo") {
            console.log(`🧠 Gerando resumo de ${command.periodDays} dia(s) para ${groupMessage.groupName}`);

            const since = new Date();
            since.setDate(since.getDate() - command.periodDays);

            try {
                const summary = await this.summaryService.summarize(
                    groupMessage.groupId,
                    groupMessage.groupName,
                    since,
                );

                await rawMessage.reply(summary);
                console.log("✅ Resumo enviado");
            } catch (error) {
                console.error("❌ Erro ao gerar resumo:", error);
                await rawMessage.reply("Ocorreu um erro ao gerar o resumo. Tente novamente.");
            }

            return;
        }

        if (command.type === "unknown") {
            await rawMessage.reply("Comando não reconhecido. Comandos disponíveis: /resumo, /resumo 7d");
        }
    }

    public async initialize(): Promise<void> {
        await this.client.initialize();
    }
}