import type { MessageRepository } from "../repositories/message.repository.js";
import type { IAProvider } from "../modules/ai/ia-provider.interface.js";
import { buildSummaryPrompt } from "../prompts/summary.prompt.js";
import { buildTopicsPrompt } from "../prompts/topics.prompt.js";
import { buildTasksPrompt } from "../prompts/tasks.prompt.js";
import type { AnalysisResult, AnalysisType } from "../types/analysis-result.js";

export class SummaryService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly aiProvider: IAProvider,
  ) {}

  public async summarize(groupId: string, groupName: string, since: Date, periodDays: number): Promise<AnalysisResult> {
    return this.runAnalysis("resumo", groupId, groupName, since, periodDays, buildSummaryPrompt);
  }

  public async extractTopics(groupId: string, groupName: string, since: Date, periodDays: number): Promise<AnalysisResult> {
    return this.runAnalysis("topicos", groupId, groupName, since, periodDays, buildTopicsPrompt);
  }

  public async extractTasks(groupId: string, groupName: string, since: Date, periodDays: number): Promise<AnalysisResult> {
    return this.runAnalysis("tarefas", groupId, groupName, since, periodDays, buildTasksPrompt);
  }

  private async runAnalysis(
    type: AnalysisType,
    groupId: string,
    groupName: string,
    since: Date,
    periodDays: number,
    promptBuilder: (params: { groupName: string; messages: string }) => string,
  ): Promise<AnalysisResult> {
    const messages = await this.messageRepository.findByGroupSince(groupId, since);

    if (messages.length === 0) {
      return {
        type,
        content: "Não há mensagens nesse período para realizar essa análise.",
        periodDays,
        periodSince: since,
      };
    }

    const formattedMessages = messages
      .map((m) => `[${m.timestamp.toLocaleString("pt-BR")}] ${m.authorName}: ${m.message}`)
      .join("\n");

    const prompt = promptBuilder({ groupName, messages: formattedMessages });
    const content = await this.aiProvider.generate(prompt);

    return { type, content, periodDays, periodSince: since };
  }
}