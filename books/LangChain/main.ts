import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import {  } from '@langchain/core/outputs';

const model = new ChatOpenAI({
  apiKey: '',
  model: 'x1',
  configuration: {
    baseURL: 'https://spark-api-open.xf-yun.com/v2',
  },
});

const run = async () => {
  const template = new PromptTemplate({
    template: 'How to say {input} in {output_language}:\n',
    inputVariables: ['input', 'output_language'],
  });

  const chain = template.pipe(model).pipe(StrOut);

  const result = await chain.invoke({
    output_language: 'German',
    input: 'I love programming.',
  });

  console.log(result);
};

run();
