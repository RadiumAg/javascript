import readline from 'readline';
import { streamAgent } from './agent.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main(): Promise<void> {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║        🤖 Code Agent (LangGraph)        ║');
  console.log('║                                          ║');
  console.log('║  能力: 改代码 | 审核代码 | MCP | Skill   ║');
  console.log('║  输入 "exit" 退出                        ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log();

  while (true) {
    const userInput = await prompt('👤 You: ');
    const trimmedInput = userInput.trim();

    if (!trimmedInput) continue;
    if (trimmedInput.toLowerCase() === 'exit') {
      console.log('\n👋 再见！');
      break;
    }

    try {
      await streamAgent(trimmedInput);
      console.log('\n');
    } catch (error) {
      console.error('\n❌ Agent 执行出错:', (error as Error).message);
      console.log();
    }
  }

  rl.close();
}

main();
