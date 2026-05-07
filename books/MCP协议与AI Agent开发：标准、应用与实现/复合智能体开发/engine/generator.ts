import 'dotenv/config';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.MIMO_API_KEY,
  baseURL: process.env.MIMO_BASE_URL,
});

export async function generateResponse(prompt: string): Promise<string> {
  const response = await client.chat.completions.create({
    model: 'mimo-v2-pro',
    messages: [{ role: 'user', content: prompt }],
  });
  return response.choices[0].message.content ?? '';
}
