/**
 * rag实例
 *
 *
 */
import path from 'path';
import dotenv from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { RetrievalQAChain } from 'langchain/chains';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
// import { QdrantVectorStore } from '@langchain/qdrant';
// import { QdrantClient } from '@qdrant/js-client-rest';
import { MultiQueryRetriever } from 'langchain/retrievers/multi_query';
import { SparkEmbeddings } from './spark-embedding';

dotenv.config({ path: path.resolve('./.local.env') });

// const client = new QdrantClient();

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

    const vectorStore = await MemoryVectorStore.fromDocuments(
      docSplits,
      new SparkEmbeddings({
        apiKey: process.env.EMBEDDINGS_LLM_API_KEY as string,
        apiSecret: process.env.EMBEDDINGS_LLM_API_SECRE as string,
      })
    );

    return vectorStore;
  }
};

const vectorStore = await createEmbedding();

if (vectorStore) {
  // 3. 实例化MultiQueryRetriever
  const retrieverFromLLM = MultiQueryRetriever.fromLLM({
    llm,
    retriever: vectorStore.asRetriever(),
    // 可选配置
    queryCount: 0,
  });

  const qaChain = RetrievalQAChain.fromLLM(llm, retrieverFromLLM);

  const response = await qaChain._call({
    query: 'react是啥',
  });

  console.log('答案:', response.text);
}
