import { Embeddings } from '@langchain/core/embeddings';
import { assembleWsAuthUrl, getBody, parserMessage } from './util.js';

interface SparkEmbeddingsParams {
  apiKey: string;
  apiSecret: string;
  model?: string;
  batchSize?: number;
}

export class SparkEmbeddings extends Embeddings {
  private batchSize: number;

  constructor(params: SparkEmbeddingsParams) {
    super(params);
    this.batchSize = params.batchSize || 5;
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    const batches = [];
    for (let i = 0; i < texts.length; i += this.batchSize) {
      const batch = texts.slice(i, i + this.batchSize);
      batches.push(batch);
    }

    const embeddings: number[][] = [];
    for (const batch of batches) {
      const batchEmbeddings = await this.embedBatch(batch);
      embeddings.push(...batchEmbeddings);
    }
    return embeddings;
  }

  async embedQuery(text: string): Promise<number[]> {
    return (await this.embedDocuments([text]))[0];
  }

  private async embedBatch(texts: string[]) {
    const responseArray = [];

    try {
      for (const text of texts) {
        const baseUrl = assembleWsAuthUrl(
          'https://emb-cn-huabei-1.xf-yun.com',
          'POST',
          process.env.EMBEDDINGS_LLM_API_KEY,
          process.env.EMBEDDINGS_LLM_API_SECRET
        );

        const body = {
          ...getBody(
            process.env.EMBEDDINGS_LLM_API_APPID as string,
            text,
            'para'
          ),
        };

        const response = await fetch(baseUrl, {
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body),
          method: 'POST',
        })
          .then(async res => {
            const textRes = await res.text();
            return parserMessage(textRes);
          })
          .catch(error => {
            console.error(error);
            return [];
          });

        responseArray.push(Array.from(response as Float32Array).slice(0, 1536));
      }

      return responseArray;
    } catch (error) {
      console.error('Error calling Spark Embeddings API:', error);
      return [];
    }
  }
}
