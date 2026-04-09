// 定义 TextContent 类型
interface TextContent {
  type: 'text';
  text: string;
}

// 定义 CreateMessageResult 类型
interface CreateMessageResult {
  role: string;
  content: TextContent;
  model: string;
  stopReason: string;
}

// 定义 Context 类型
interface Context {
  session: {
    call_tool: (params: { tool_name: string; tool_input: any }) => Promise<{
      content: Array<{ text: string }>;
    }>;
  };
}

// 简易意图识别函数
function classifyIntent(text: string): string {
  console.error('[意图识别]', text);
  if (text.includes('总结') || text.includes('概括')) {
    return 'summarizer';
  } else if (text.includes('归档') || text.includes('标签')) {
    return 'archiver';
  } else if (text.includes('回复') || text.includes('答复')) {
    return 'reply_generator';
  } else if (text.includes('分类') || text.includes('是什么类型')) {
    return 'classifier';
  } else {
    return 'mail_parser';
  }
}

// 路由器主函数
async function routeMessage(
  context: Context,
  text: string,
): Promise<CreateMessageResult> {
  const intent = classifyIntent(text);
  console.error(`[路由判断] 当前意图: ${intent}`);

  const response = await context.session.call_tool({
    tool_name: intent,
    tool_input: { text: text },
  });

  return {
    role: 'assistant',
    content: {
      type: 'text',
      text: response.content[0].text,
    },
    model: 'mcp-router',
    stopReason: 'endTurn',
  };
}

export { classifyIntent, routeMessage };
