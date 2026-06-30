import { prisma } from "../database/prisma.js";
import type { AnalysisResult } from "../types/analysis-result.js";

export class SummaryRepository {
  public async save(
    groupId: string,
    groupName: string,
    result: AnalysisResult,
  ): Promise<void> {
    await prisma.summary.create({
      data: {
        groupId,
        groupName,
        type: result.type,
        content: result.content,
        periodDays: result.periodDays,
        periodSince: result.periodSince,
      },
    });
  }
}