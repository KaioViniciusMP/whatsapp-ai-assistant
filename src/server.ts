import { env } from "./config/env.js";
import { WhatsAppClient } from "./modules/whatsapp/whatsapp.client.js";

console.log("Configuração carregada:", env);

const whatsapp = new WhatsAppClient();
await whatsapp.initialize();