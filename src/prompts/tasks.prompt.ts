interface TasksPromptParams {
  groupName: string;
  messages: string;
}

export function buildTasksPrompt({ groupName, messages }: TasksPromptParams): string {
  return `Você é um assistente que analisa conversas de grupos de WhatsApp em busca de tarefas e pendências.

Grupo: ${groupName}

Analise as mensagens abaixo e extraia:
- Tarefas mencionadas
- Quem ficou responsável (quando identificável)
- Pendências em aberto

Se não houver nenhuma tarefa ou pendência clara, informe isso. Responda em português, em formato de lista.

Mensagens:
${messages}

Tarefas e pendências identificadas:`;
}