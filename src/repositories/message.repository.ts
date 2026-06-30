import { prisma } from "../database/prisma.js";
import type { GroupMessage } from "../types/group-message.js";

export class MessageRepository {
  public async save(message: GroupMessage): Promise<void> {
    await prisma.message.create({
      data: {
        groupId: message.groupId,
        groupName: message.groupName,
        authorId: message.authorId,
        authorName: message.authorName,
        message: message.message,
        timestamp: message.timestamp,
      },
    });
  }

  public async findByGroupSince(groupId: string, since: Date) {
    return prisma.message.findMany({
      where: {
        groupId,
        timestamp: {
          gte: since,
        },
      },
      orderBy: {
        timestamp: "asc",
      },
    });
  }
}