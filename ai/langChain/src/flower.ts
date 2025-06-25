/**
 * rag实例
 *
 *
 */
import path from 'path';
import dotenv from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';
import { MultiQueryRetriever } from 'langchain/retrievers/multi_query';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { RetrievalQAChain } from 'langchain/chains';
import { QdrantVectorStore } from '@langchain/qdrant';
import { QdrantClient } from '@qdrant/js-client-rest';
import { SparkEmbeddings } from './spark-embedding';

dotenv.config({ path: path.resolve('./.local.env') });

const client = new QdrantClient({
  url: 'https://f7b6a1dd-3e2c-40f0-9010-4410f60e639c.eu-west-1-0.aws.cloud.qdrant.io:6333',
  apiKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0._cdnZI1jlc4jilHhQuKgyLlMtvAu0e21ar2Gg2OuJnY',
});

const llm = new ChatOpenAI({
  model: 'x1',
  apiKey: process.env.CHAT_LLM_API_KEY,
  temperature: 0,
  configuration: {
    baseURL: 'https://spark-api-open.xf-yun.com/v2',
  },
});

const createEmbedding = async () => {
  const filePath = path.resolve('./doc', 'test.text');

  const loader = new TextLoader(filePath);

  const rawDocs = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 250,
  });

  if (rawDocs) {
    const docSplits = await textSplitter.splitDocuments(rawDocs);

    const vectorStore = await QdrantVectorStore.fromDocuments(
      docSplits,
      new SparkEmbeddings({
        apiKey: process.env.EMBEDDINGS_LLM_API_KEY as string,
        apiSecret: process.env.EMBEDDINGS_LLM_API_SECRE as string,
      }),
      {
        client,
        collectionName: 'leanai',
      }
    );

    return vectorStore;
  }
};

const vectorStore = await createEmbedding();

// if (vectorStore) {
//   // 3. 实例化MultiQueryRetriever
//   const retrieverFromLLM = MultiQueryRetriever.fromLLM({
//     llm,
//     retriever: vectorStore.asRetriever(),
//     // 可选配置
//     verbose: true,
//     queryCount: 3, // 默认生成3个查询变体
//   });

//   const qaChain = RetrievalQAChain.fromLLM(llm, {
//     retriever: retrieverFromLLM,
//     // 可选配置
//     returnSourceDocuments: true,
//     verbose: true,
//     inputKey: 'query', // 默认输入键
//     outputKey: 'result', // 默认输出键
//   });

//   const response = await qaChain._call({
//     query: '响应式系统是啥',
//   });

//   console.log('答案:', response.result);
//   console.log('参考文档:', response.sourceDocuments);
// }
