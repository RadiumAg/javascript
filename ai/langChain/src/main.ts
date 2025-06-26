import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate, PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const model = new ChatOpenAI({
  model: 'x1',
  configuration: {
    baseURL: 'https://spark-api-open.xf-yun.com/v2',
  },
});

const strOutPut = new StringOutputParser();

const promptTemplate = async () => {
  const template = new PromptTemplate({
    template: 'How to say {input} in {output_language}:\n',
    inputVariables: ['input', 'output_language'],
  });

  const chain = template.pipe(model).pipe(strOutPut);

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

  const chain = template.pipe(model).pipe(strOutPut);

  const result = await chain.invoke({
    output_language: 'Chinese',
    input: 'I love programming.',
  });

  console.log(result);
};

const prompt = PromptTemplate.fromTemplate(
  '您是一位专业的前端开发工程师，您能告诉我{tech}是什么吗？'
);

prompt.format({ tech: 'vue' });

console.log(prompt);
