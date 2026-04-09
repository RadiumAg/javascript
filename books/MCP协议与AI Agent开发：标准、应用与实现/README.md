# MCP 路由服务器

一个基于 MCP 协议的消息路由服务器，用于意图识别和任务分发。

## 为什么"输入没用"？

**重要**：MCP 服务器不是交互式命令行程序！它是通过 stdio 协议与 MCP 客户端（如 Claude Desktop）通信的后台服务。

### MCP 工作原理

```
用户 → Claude Desktop → MCP 服务器 → 处理 → 返回结果 → Claude Desktop → 用户
```

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 开发模式运行

```bash
pnpm dev
```

### 3. 构建生产版本

```bash
pnpm build
pnpm start
```

## 配置 Claude Desktop

### 方法一：手动配置

1. 打开 Claude Desktop 配置文件：
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

2. 添加以下配置：

```json
{
  "mcpServers": {
    "mcp-router-server": {
      "command": "pnpm",
      "args": ["dev"],
      "cwd": "/Users/zly/Desktop/work/javascript/books/MCP协议与AI Agent开发：标准、应用与实现"
    }
  }
}
```

3. 重启 Claude Desktop

### 方法二：使用配置文件

复制 `claude_desktop_config.json` 的内容到 Claude Desktop 的配置文件中。

## 使用方式

配置完成后，在 Claude Desktop 中：

1. 服务器会自动启动
2. 你可以直接向 Claude 发送消息
3. Claude 会调用 `process_message` 工具处理你的消息
4. 服务器会根据消息内容识别意图并分发任务

### 示例对话

```
用户：帮我总结一下这封邮件
Claude：[调用 process_message 工具] → 识别为 "summarizer" 意图 → 返回处理结果
```

## 支持的意图类型

- **summarizer**: 总结、概括
- **archiver**: 归档、标签
- **reply_generator**: 回复、答复
- **classifier**: 分类、是什么类型
- **mail_parser**: 默认邮件解析

## 项目结构

```
.
├── main.ts           # 主服务器入口
├── router.ts         # 路由逻辑
├── package.json      # 项目配置
├── tsconfig.json     # TypeScript 配置
└── README.md         # 本文档
```

## 开发

### 监听模式

```bash
pnpm watch
```

### 调试

服务器日志会输出到 stderr，可以在 Claude Desktop 的日志中查看。

## 常见问题

### Q: 为什么直接运行 `pnpm dev` 后输入没反应？

A: MCP 服务器不是交互式程序，它需要通过 Claude Desktop 等 MCP 客户端来调用。直接运行只会启动服务器等待客户端连接。

### Q: 如何测试服务器是否正常工作？

A: 配置到 Claude Desktop 后，在对话中发送消息，观察是否有响应。

### Q: 如何查看服务器日志？

A: 查看 Claude Desktop 的日志文件，或者在代码中使用 `console.error()` 输出日志。

## 技术栈

- **MCP SDK**: @modelcontextprotocol/sdk
- **TypeScript**: 类型安全
- **Zod**: 参数验证
- **Node.js**: 运行环境
