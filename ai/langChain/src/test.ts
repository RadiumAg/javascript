import path from 'path';
import { ChatOpenAI } from '@langchain/openai';
import {
  ChatPromptTemplate,
  FewShotPromptTemplate,
  PromptTemplate,
} from '@langchain/core/prompts';
import dotenv from 'dotenv';
import { StringOutputParser } from '@langchain/core/output_parsers';

dotenv.config({ path: path.resolve('./.local.env') });

const llm = new ChatOpenAI({
  model: 'x1',
  apiKey: process.env.CHAT_LLM_API_KEY,
  configuration: {
    baseURL: 'https://spark-api-open.xf-yun.com/v2',
  },
});

const strOutPut = new StringOutputParser();

() => {
  const promptTemplate = async () => {
    const template = new PromptTemplate({
      template: 'How to say {input} in {output_language}:\n',
      inputVariables: ['input', 'output_language'],
    });

    const chain = template.pipe(llm).pipe(strOutPut);

    const result = await chain.invoke({
      output_language: 'Chinese',
      input: 'I love programming.',
    });

    console.log(result);
  };

  const chatMessage = async () => {
    const template = ChatPromptTemplate.fromMessages([
      ['system', 'You are a wondrous wizard of math.'],
      ['user', 'I love programming.'],
      ['system', 'I love programming too.'],
    ]);

    const chain = template.pipe(llm).pipe(strOutPut);

    const result = await chain.invoke({
      output_language: 'Chinese',
      input: 'I love programming.',
    });

    console.log(result);
  };
};

// FewShotPromptTemplate
(async () => {
  const samples = [
    {
      flowerType: '玫瑰',
      occasion: '爱情',
      adCopy: '玫瑰，浪漫的象征，是你向心爱的人表达爱意的最佳选择。',
    },
    {
      flowerType: '康乃馨',
      occasion: '母亲节',
      adCopy: '康乃馨代表着母爱的纯洁与伟大，是母亲节赠送给母亲的完美礼物。',
    },
    {
      flowerType: '百合',
      occasion: '庆祝',
      adCopy: '百合象征着纯洁与高雅，是你庆祝特殊时刻的理想选择。',
    },
    {
      flowerType: '向日葵',
      occasion: '鼓励',
      adCopy: '向日葵象征着坚韧和乐观，是你鼓励亲朋好友的最好方式。',
    },
  ];

  const template = '鲜花类型：{flowerType}\n场合：{occasion}\n文案：{adCopy}';
  const promptSample = new PromptTemplate({
    template,
    inputVariables: ['flowerType', 'occasion', 'adCopy'],
  });

  const prompt = new FewShotPromptTemplate({
    examples: samples,
    examplePrompt: promptSample,
    suffix: '鲜花类型：{flowerType}\n场合：{occasion}',
    inputVariables: ['flowerType', 'occasion'],
  });

  const result = await llm.invoke(
    await prompt.format({ flowerType: '野玫瑰', occasion: '偷情' })
  );

  console.log('result', result.content);
})();
