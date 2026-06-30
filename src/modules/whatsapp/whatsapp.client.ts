import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { mapToGroupMessage } from "./message.mapper.js";
import type { MessageRepository } from "../../repositories/message.repository.js";

const { Client, LocalAuth } = pkg;

export class WhatsAppClient {
  private client: pkg.Client;

  constructor(private readonly messageRepository: MessageRepository) {
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

    this.client.on("message", async (message) => {
      const groupMessage = await mapToGroupMessage(message);

      if (!groupMessage) {
        return;
      }

      try {
        await this.messageRepository.save(groupMessage);
        console.log("💾 Mensagem salva:", {
          group: groupMessage.groupName,
          author: groupMessage.authorName,
        });
      } catch (error) {
        console.error("❌ Erro ao salvar mensagem:", error);
      }
    });
  }

  public async initialize(): Promise<void> {
    await this.client.initialize();
  }
}