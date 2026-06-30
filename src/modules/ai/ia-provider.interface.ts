export interface IAProvider {
  generate(prompt: string): Promise<string>;
}