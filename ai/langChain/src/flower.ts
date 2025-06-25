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
import { QdrantVectorStore } from '@langchain/qdrant';
import { QdrantClient } from '@qdrant/js-client-rest';
import { SparkEmbeddings } from './spark-embedding';
// eslint-disable-next-line import/order
import { MultiQueryRetriever } from 'langchain/retrievers/multi_query';

dotenv.config({ path: path.resolve('./.local.env') });

const client = new QdrantClient({
  url: 'https://6d56580b-8ef5-4d3a-bb43-ded4c74060d2.us-east4-0.gcp.cloud.qdrant.io:6333',
  apiKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.tIxqyqByHXWlh-Erer7HrNM54Jqk9Ym780k9BBYf_fY',
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
    query: '',
  });

  console.log('答案:', response.result);
  console.log('参考文档:', response.sourceDocuments);
}
