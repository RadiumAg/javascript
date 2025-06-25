/**
 * rag实例
 *
 *
 */
import path from 'path';
import fs from 'fs';
import PdfParse from 'pdf-parse/lib/pdf-parse';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import dotenv from 'dotenv';
import { assembleWsAuthUrl, getBody, parserMessage } from './util.js';

const llm = new ChatOpenAI({
  model: 'x1',
  apiKey: process.env.CHAT_LLM_API_KEY,
  configuration: {
    baseURL: 'https://spark-api-open.xf-yun.com/v2',
  },
});

const loadFile = async (path: string) => {
  if (path.endsWith('.pdf')) {
    const dataBuffer = fs.readFileSync(path);
    const data = await PdfParse(dataBuffer);
    return data;
  }

  if (path.endsWith('.text')) {
    const dataBuffer = fs.readFileSync(path);
    return dataBuffer.toString();
  }
};

const filePath = path.resolve('./doc', 'test.text');

const docContent = await loadFile(filePath);

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 250,
});

if (docContent) {
  const docSplits = await textSplitter.splitText(docContent);

  const vectorStore = await MemoryVectorStore.fromTexts(
    docSplits,
    [],
    new OpenAIEmbeddings({
      configuration: {
        fetch: (input: string | URL | Request, init?: RequestInit) => {
          const url = input.toString().replace('/embeddings', '');
          if (init === null || init === undefined) return fetch(input, init);
          if (init.body === null || init.body === undefined)
            return fetch(input, init);

          // const orginBody = JSON.parse(init.body.toString());

          const body = {
            ...getBody(
              process.env.EMBEDDINGS_LLM_API_APPID as string,
              JSON.parse(init.body as string).input.join(','),
              'para'
            ),
          };

          return fetch(url, {
            ...init,
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(body),
          })
            .then(async (res) => {
              const textRes = await res.text();

              return {
                headers: res.headers,
                text: res.text,
                body: parserMessage(textRes),
              };
            })
            .catch((error) => {
              console.error(error);
            });
        },
        baseURL: assembleWsAuthUrl(
          'https://emb-cn-huabei-1.xf-yun.com',
          'POST',
          process.env.EMBEDDINGS_LLM_API_KEY,
          process.env.EMBEDDINGS_LLM_API_SECRET
        ),
        apiKey: process.env.EMBEDDINGS_LLM_API_KEY,
      },
    })
  );

  const retriever = vectorStore.asRetriever();

  console.log(retriever);
}
