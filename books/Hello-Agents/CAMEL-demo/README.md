# CAMEL Demo

基于 [CAMEL-AI](https://github.com/camel-ai/camel) 框架的入门示例项目，演示单 Agent 对话与多 Agent 角色扮演协作。

## 目录结构

```
CAMEL-demo/
├── single_agent.py     # 单 Agent 对话示例
├── role_playing.py     # 多 Agent 角色扮演示例
├── requirements.txt    # 依赖列表
├── .env.example        # 环境变量模板
└── README.md
```

## 环境准备

建议使用 Python 3.10+。

```bash
cd /Users/zly/Desktop/work/javascript/books/Hello-Agents/CAMEL-demo

# 创建虚拟环境
python3 -m venv .venv
source .venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env，填入 OPENAI_API_KEY
```

## 运行示例

```bash
# 单 Agent 示例
python single_agent.py

# 多 Agent 角色扮演示例
python role_playing.py
```

## 说明

- `single_agent.py`：使用 `ChatAgent` 创建一个 Python 编程助手，进行单轮问答。
- `role_playing.py`：通过 `RolePlaying` 构建 "产品经理 ↔ Python 教程作者" 双 Agent 协作，自动细化任务并多轮对话直至完成。

如需更换模型（例如 DeepSeek、Moonshot、Ollama 等 OpenAI 兼容服务），修改 `.env` 中的 `OPENAI_API_BASE_URL` 即可。
