export type AnalysisType = "resumo" | "topicos" | "tarefas";

export interface AnalysisResult {
  type: AnalysisType;
  content: string;
  periodDays: number;
  periodSince: Date;
}