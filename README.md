# WhatsApp AI Assistant

Assistente de IA para grupos de WhatsApp que escuta mensagens, armazena histórico e gera resumos, identifica tópicos e extrai tarefas usando LLMs.

---

## Visão Geral

O sistema conecta ao WhatsApp via `whatsapp-web.js`, persiste todas as mensagens de grupos em SQLite via Prisma e expõe comandos que acionam um LLM (Google Gemini) para gerar resumos, listar tópicos e extrair tarefas — tudo de dentro do próprio grupo.

---

## Arquitetura

O projeto segue uma arquitetura em camadas inspirada em Clean Architecture, separando responsabilidades de forma que a troca de LLM, banco de dados ou canal de mensagens não exija alterações nas regras de negócio.

```
src/
├── config/          # Carregamento e validação de variáveis de ambiente
├── database/        # Configuração do cliente Prisma
├── modules/
│   ├── whatsapp/    # Conexão, autenticação e listener de mensagens
│   ├── ai/          # Interface IAProvider e implementações (Gemini, OpenAI, etc.)
│   ├── summary/     # Casos de uso: gerar resumo, tópicos, tarefas
│   └── commands/    # Parser de comandos (/resumo, /topicos, /tarefas)
├── services/        # Serviços de aplicação (orquestram módulos)
├── repositories/    # Acesso a dados (MessageRepository)
├── prompts/         # Arquivos de prompt separados por funcionalidade
├── utils/           # Helpers utilitários
├── types/           # Tipos e interfaces globais
├── jobs/            # Agendamentos com node-cron
├── app.ts           # Composição da aplicação (wiring de dependências)
└── server.ts        # Entrypoint
```

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| Node.js + TypeScript | Runtime e tipagem |
| whatsapp-web.js | Integração com WhatsApp |
| Prisma ORM | Acesso ao banco de dados |
| SQLite | Banco de dados local |
| Google Gemini API | LLM para geração de resumos |
| node-cron | Agendamento de tarefas |
| tsx | Execução em desenvolvimento |
| ESLint + Prettier | Qualidade de código |
| dotenv | Gerenciamento de variáveis de ambiente |

---

## Como Instalar

**Pré-requisitos:** Node.js 20+

```bash
git clone https://github.com/KaioViniciusMP/whatsapp-ai-assistant.git
cd whatsapp-ai-assistant
npm install
```

---

## Como Configurar

Copie o arquivo de exemplo e preencha as variáveis:

```bash
cp .env.example .env
```

| Variável | Descrição |
|---|---|
| `GEMINI_API_KEY` | Chave da API do Google Gemini |
| `DATABASE_URL` | Caminho do banco SQLite (ex: `file:./dev.db`) |
| `SUMMARY_HOUR` | Hora do resumo diário automático (ex: `8` para 08:00) |

---

## Como Obter a Chave do Gemini

1. Acesse [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Clique em **Create API Key**
3. Copie a chave gerada e cole em `GEMINI_API_KEY` no seu `.env`

---

## Como Executar

**Desenvolvimento (com hot reload):**
```bash
npm run dev
```

**Produção:**
```bash
npm run build
npm start
```

Na primeira execução, um QR Code será exibido no terminal. Escaneie com o WhatsApp do celular para autenticar.

---

## Comandos Disponíveis nos Grupos

| Comando | Descrição |
|---|---|
| `/resumo` | Resumo das últimas 24 horas |
| `/resumo 7d` | Resumo dos últimos 7 dias |
| `/topicos` | Principais assuntos discutidos |
| `/tarefas` | Tarefas, responsáveis e pendências |

---

## Como Testar

```bash
# Verificar lint
npm run lint

# Formatar código
npm run format

# Build de produção
npm run build
```

---

## Roadmap

- [x] Setup Node.js + TypeScript + ESLint + Prettier
- [ ] Conexão com WhatsApp via QR Code
- [ ] Filtro e persistência de mensagens de grupo (SQLite + Prisma)
- [ ] Interface `IAProvider` + implementação `GeminiProvider`
- [ ] Prompts separados por funcionalidade
- [ ] Comandos `/resumo`, `/topicos`, `/tarefas`
- [ ] Agendamentos com node-cron (resumo diário/semanal)
- [ ] Logs estruturados
- [ ] RAG com banco vetorial
- [ ] Memória de longo prazo
- [ ] MCP (Model Context Protocol)
- [ ] Dashboard Web
- [ ] API REST
- [ ] Docker
- [ ] PostgreSQL
- [ ] Geração de atas de reunião
- [ ] Detecção automática de decisões
- [ ] Pesquisa semântica com embeddings
- [ ] Sistema de plugins
- [ ] Suporte a múltiplos modelos (OpenAI, Ollama, Claude)

---

## Estrutura de Dados

**Tabela `Messages`**

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador único |
| `groupId` | String | ID do grupo no WhatsApp |
| `groupName` | String | Nome do grupo |
| `authorId` | String | ID do autor |
| `authorName` | String | Nome do autor |
| `message` | String | Conteúdo da mensagem |
| `timestamp` | DateTime | Data e hora da mensagem |

---

## Licença

ISC
