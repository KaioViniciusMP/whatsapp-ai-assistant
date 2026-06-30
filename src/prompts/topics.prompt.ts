interface TopicsPromptParams {
  groupName: string;
  messages: string;
}

export function buildTopicsPrompt({ groupName, messages }: TopicsPromptParams): string {
  return `Você é um assistente que analisa conversas de grupos de WhatsApp.

Grupo: ${groupName}

Analise as mensagens abaixo e identifique os principais assuntos/tópicos discutidos. Liste cada tópico com um breve resumo de uma ou duas linhas. Responda em português.

Mensagens:
${messages}

Principais tópicos:`;
}