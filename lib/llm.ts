import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: 'https://api.deepseek.com',
});

export async function callLLM(prompt: string): Promise<string> {
  const { text } = await generateText({
    model: deepseek('deepseek-chat'),
    prompt,
    temperature: 0.3, // Lower temperature for more consistent translations
  });

  return text;
}
