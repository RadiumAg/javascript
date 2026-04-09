# MCP 服务器 vs 交互式命令行程序

## 交互式命令行程序（你期望的行为）

```typescript
// 这是一个交互式命令行程序
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('请输入消息:');

rl.on('line', (input) => {
  console.log(`你输入了: ${input}`);
  const result = processInput(input); // ✅ 这里会接收到你的输入
  console.log(`处理结果: ${result}`);
});
```

**工作流程**：
```
你在终端输入 → stdin → readline 读取 → processInput() 处理 → 输出到终端
```

---

## MCP 服务器（当前的实现）

```typescript
// 这是一个 MCP 服务器
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new McpServer(...);

server.registerTool('process_message', {...}, async ({ message }) => {
  const result = await processInput(message); // ❌ message 不是来自终端输入！
  return { content: result.content };
});

await server.connect(new StdioServerTransport());
// stdin 被 StdioServerTransport 占用，用于接收 JSON-RPC 消息
```

**工作流程**：
```
Claude Desktop 发送 JSON-RPC 消息 
  → stdin (被 StdioServerTransport 监听)
  → 解析 JSON-RPC 
  → 提取 message 参数
  → 调用 processInput(message)
  → 返回 JSON-RPC 响应
  → Claude Desktop 显示结果
```

---

## 关键区别

| 特性 | 交互式命令行 | MCP 服务器 |
|------|-------------|-----------|
| **stdin 用途** | 接收用户输入 | 接收 JSON-RPC 消息 |
| **输入格式** | 纯文本 | JSON-RPC 协议 |
| **输出方式** | stdout 打印 | JSON-RPC 响应 |
| **使用方式** | 直接在终端运行 | 通过 MCP 客户端调用 |
| **你的输入** | 直接可见 | 必须通过客户端 |

---

## 为什么你的输入"没用"？

当你运行 `pnpm dev` 后：

1. **StdioServerTransport 接管了 stdin**
   - stdin 现在用于接收 JSON-RPC 消息
   - 不再是普通的文本输入

2. **你在终端输入的内容**
   - 不是有效的 JSON-RPC 格式
   - 会被 StdioServerTransport 忽略或报错
   - 永远不会到达 `processInput(message)`

3. **正确的输入方式**
   - 必须通过 Claude Desktop 等 MCP 客户端
   - 客户端会构造正确的 JSON-RPC 消息
   - 然后发送到服务器的 stdin

---

## 如何测试你的服务器？

### ❌ 错误方式
```bash
$ pnpm dev
[MCP 服务器已启动] 等待客户端连接...
帮我总结一下  # ← 这样输入没用！
```

### ✅ 正确方式

**方法 1：使用 Claude Desktop**
1. 配置 Claude Desktop（见 README.md）
2. 重启 Claude Desktop
3. 在 Claude 对话中输入消息
4. Claude 会自动调用你的工具

**方法 2：手动发送 JSON-RPC 消息（调试用）**
```bash
$ pnpm dev
# 然后在另一个终端手动发送 JSON-RPC 消息
$ echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"process_message","arguments":{"message":"测试"}}}' | pnpm dev
```

**方法 3：使用 MCP Inspector（推荐）**
```bash
$ npx @modelcontextprotocol/inspector pnpm dev
# 会打开一个 Web 界面，可以可视化地测试你的工具
```

---

## 总结

**你的代码没有问题！** 问题在于使用方式：

- MCP 服务器 ≠ 交互式命令行程序
- stdin 被用于 JSON-RPC 通信，不是普通输入
- 必须通过 MCP 客户端（如 Claude Desktop）来使用
- 终端直接输入永远不会到达 `processInput(message)`

这就是为什么"启动后在终端输入消息，代码里没接收"的原因！
