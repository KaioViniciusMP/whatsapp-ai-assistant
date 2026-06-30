import { env } from "./config/env.js";
import { MessageRepository } from "./repositories/message.repository.js";
import { WhatsAppClient } from "./modules/whatsapp/whatsapp.client.js";

console.log("Configuração carregada:", env);

const messageRepository = new MessageRepository();
const whatsapp = new WhatsAppClient(messageRepository);

await whatsapp.initialize();