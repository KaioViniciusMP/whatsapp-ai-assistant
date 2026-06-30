import { env } from "./config/env.js";
import { MessageRepository } from "./repositories/message.repository.js";
import { SummaryRepository } from "./repositories/summary.repository.js";
import { GeminiProvider } from "./modules/ai/gemini.provider.js";
import { SummaryService } from "./services/summary.service.js";
import { WhatsAppClient } from "./modules/whatsapp/whatsapp.client.js";

console.log("Configuração carregada:", {
  ...env,
  geminiApiKey: env.geminiApiKey ? "[definida]" : "[ausente]",
});

const messageRepository = new MessageRepository();
const summaryRepository = new SummaryRepository();
const aiProvider = new GeminiProvider(env.geminiApiKey);
const summaryService = new SummaryService(messageRepository, aiProvider);

const whatsapp = new WhatsAppClient(messageRepository, summaryService, summaryRepository);

await whatsapp.initialize();