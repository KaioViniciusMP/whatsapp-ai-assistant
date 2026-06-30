export type Command =
  | { type: "resumo"; periodDays: number }
  | { type: "topicos" }
  | { type: "tarefas" }
  | { type: "unknown" };

export function parseCommand(text: string): Command | null {
  const trimmed = text.trim().toLowerCase();

  if (!trimmed.startsWith("/")) {
    return null;
  }

  if (trimmed === "/resumo") {
    return { type: "resumo", periodDays: 1 };
  }

  const resumoComPeriodoMatch = trimmed.match(/^\/resumo\s+(\d+)d$/);
  if (resumoComPeriodoMatch) {
    return { type: "resumo", periodDays: Number(resumoComPeriodoMatch[1]) };
  }

  if (trimmed === "/topicos") {
    return { type: "topicos" };
  }

  if (trimmed === "/tarefas") {
    return { type: "tarefas" };
  }

  return { type: "unknown" };
}