import type { Message } from "whatsapp-web.js";
import type { GroupMessage } from "../../types/group-message.js";

export async function mapToGroupMessage(message: Message): Promise<GroupMessage | null> {
  const isGroup = message.from.endsWith("@g.us");

  if (!isGroup) {
    return null;
  }

  if (!message.body.trim()) {
    return null;
  }

  const chat = await message.getChat();
  const contact = await message.getContact();

  return {
    groupId: message.from,
    groupName: chat.name,
    authorId: message.author ?? message.from,
    authorName: contact.pushname || contact.number,
    message: message.body,
    timestamp: new Date(message.timestamp * 1000),
  };
}