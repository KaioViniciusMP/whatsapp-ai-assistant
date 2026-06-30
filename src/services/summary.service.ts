import type { MessageRepository } from "../repositories/message.repository.js";
import type { IAProvider } from "../modules/ai/ia-provider.interface.js";
import { buildSummaryPrompt } from "../prompts/summary.prompt.js";

export class SummaryService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly aiProvider: IAProvider,
  ) {}

  public async summarize(groupId: string, groupName: string, since: Date): Promise<string> {
    const messages = await this.messageRepository.findByGroupSince(groupId, since);

    if (messages.length === 0) {
      return "Não há mensagens nesse período para gerar um resumo.";
    }

    const formattedMessages = messages
      .map((m) => `[${m.timestamp.toLocaleString("pt-BR")}] ${m.authorName}: ${m.message}`)
      .join("\n");

    const prompt = buildSummaryPrompt({ groupName, messages: formattedMessages });

    return this.aiProvider.generate(prompt);
  }
}