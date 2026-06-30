import type { Message } from "whatsapp-web.js";
import type { GroupMessage } from "../../types/group-message.js";

export async function mapToGroupMessage(message: Message): Promise<GroupMessage | null> {
  const chatId = message.fromMe ? message.to : message.from;
  const isGroup = chatId.endsWith("@g.us");

  if (!isGroup) {
    return null;
  }

  if (!message.body.trim()) {
    return null;
  }

  let groupName = chatId;
  let authorName = message.author ?? message.from;

  try {
    const chat = await message.getChat();
    groupName = chat.name;
  } catch (error) {
    console.warn("⚠️ Não foi possível obter o nome do grupo:", error);
  }

  try {
    const contact = await message.getContact();
    authorName = contact.pushname || contact.number;
  } catch (error) {
    console.warn("⚠️ Não foi possível obter o contato do autor:", error);
  }

  return {
    groupId: chatId,
    groupName,
    authorId: message.author ?? message.from,
    authorName,
    message: message.body,
    timestamp: new Date(message.timestamp * 1000),
  };
}