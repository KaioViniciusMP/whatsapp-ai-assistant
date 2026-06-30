interface SummaryPromptParams {
  groupName: string;
  messages: string;
}

export function buildSummaryPrompt({ groupName, messages }: SummaryPromptParams): string {
  return `Você é um assistente que resume conversas de grupos de WhatsApp.

Grupo: ${groupName}

Abaixo estão as mensagens trocadas no grupo. Gere um resumo claro, objetivo e bem organizado dos principais assuntos discutidos, em português, usando tópicos quando fizer sentido.

Mensagens:
${messages}

Resumo:`;
}