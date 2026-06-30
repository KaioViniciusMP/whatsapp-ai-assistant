import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const { Client, LocalAuth } = pkg;

export class WhatsAppClient {
  private client: pkg.Client;

  constructor() {
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

    this.client.on("message", (message) => {
      console.log("📩 Nova mensagem recebida:", {
        from: message.from,
        body: message.body,
        isGroup: message.from.endsWith("@g.us"),
      });
    });
  }

  public async initialize(): Promise<void> {
    await this.client.initialize();
  }
}