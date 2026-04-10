/**
 * 测试 MCP 客户端
 * 用于验证客户端与服务器的连接和通信
 */

import { createSession, executeSampling } from './session.js';
import type { CreateMessageRequestParams } from '@modelcontextprotocol/sdk/types.js';

async function main() {
  console.log('🚀 启动 MCP 客户端测试\n');

  try {
    // 1. 创建会话
    console.log('1️⃣ 创建客户端会话...');
    const session = await createSession();
    console.log('✅ 会话创建成功\n');

    // 2. 列出可用工具
    console.log('2️⃣ 获取服务器工具列表...');
    const toolsResult = await session.listTools();
    console.log('✅ 可用工具:');
    toolsResult.tools.forEach((tool) => {
      console.log(`   - ${tool.name}: ${tool.description}`);
    });
    console.log();

    // 3. 调用工具
    console.log('3️⃣ 调用 process_message 工具...');
    const toolResult = await session.callTool({
      name: 'process_message',
      arguments: {
        message: '你好，这是一条测试消息',
      },
    });
    console.log('✅ 工具调用结果:', JSON.stringify(toolResult, null, 2));
    console.log();

    // 4. 测试采样回调
    console.log('4️⃣ 测试采样回调...');
    const samplingParams: CreateMessageRequestParams = {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: '测试消息',
          },
        },
      ],
      maxTokens: 100,
    };
    const samplingResult = await executeSampling(session, samplingParams);
    console.log('✅ 采样结果:', JSON.stringify(samplingResult, null, 2));
    console.log();

    // 5. 关闭会话
    console.log('5️⃣ 关闭会话...');
    await session.close();
    console.log('✅ 会话已关闭\n');

    console.log('🎉 所有测试通过！');
  } catch (error) {
    console.error('❌ 测试失败:', error);
    process.exit(1);
  }
}

main();
