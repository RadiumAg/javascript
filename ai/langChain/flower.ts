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
import { assembleWsAuthUrl, getBody } from './util.js';

dotenv.config({ path: path.resolve('./.local.env') });

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
      model: 'text-embedding-3-large',

      configuration: {
        fetchOptions: {
          body: JSON.stringify(
            getBody(process.env.EMBEDDINGS_LLM_API_APPID, docSplits)
          ),
        },
        defaultHeaders: {
          status: '3',
          appId: 'dc131790',
        },

        baseURL: assembleWsAuthUrl(
          'https://emb-cn-huabei-1.xf-yun.com',
          'post',
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
