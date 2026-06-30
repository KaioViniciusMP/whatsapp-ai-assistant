import { config } from "dotenv";

config();

function getEnvVar(key: string, required = true): string {
  const value = process.env[key];

  if (required && !value) {
    throw new Error(`Variável de ambiente obrigatória não definida: ${key}`);
  }

  return value ?? "";
}

export const env = {
  geminiApiKey: getEnvVar("GEMINI_API_KEY"),
  databaseUrl: getEnvVar("DATABASE_URL"),
  summaryHour: getEnvVar("SUMMARY_HOUR", false) || "08:00",
};