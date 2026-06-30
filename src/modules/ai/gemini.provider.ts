import { GoogleGenAI } from "@google/genai";
import type { IAProvider } from "./ia-provider.interface.js";

export class GeminiProvider implements IAProvider {
  private readonly client: GoogleGenAI;
  private readonly model = "gemini-2.5-flash";

  constructor(apiKey: string) {
    this.client = new GoogleGenAI({ apiKey });
  }

  public async generate(prompt: string): Promise<string> {
    try {
      const response = await this.client.models.generateContent({
        model: this.model,
        contents: prompt,
      });

      return response.text ?? "";
    } catch (error) {
      console.error("❌ Erro ao gerar conteúdo com Gemini:", error);
      throw new Error("Falha ao gerar resposta da IA");
    }
  }
}