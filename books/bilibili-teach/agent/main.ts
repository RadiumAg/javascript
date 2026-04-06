import path from 'path';
import { ChatOpenAI } from '@langchain/openai';
process.loadEnvFile(path.resolve(import.meta.dirname, './', '.env'));

const model = new ChatOpenAI({
  model: 'qwen-turbo',
  apiKey: process.env.OPENAI_API_KEY,
  streaming: false,
  configuration: {
    baseURL: process.env.OPENAI_API_BASE_URL,
  },
});

model.invoke('Hello, how are you?')
  .then((response) => {
    console.log('Response:', response);
    console.log('Content:', response.content);
  })
  .catch((error) => {
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error response:', error.response?.data);
  });
