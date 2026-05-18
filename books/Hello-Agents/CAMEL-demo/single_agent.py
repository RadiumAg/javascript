"""
CAMEL 单 Agent Demo
演示如何使用 ChatAgent 与单个智能体进行对话。
"""

import os
from dotenv import load_dotenv

from camel.agents import ChatAgent
from camel.messages import BaseMessage
from camel.models import ModelFactory
from camel.types import ModelPlatformType, ModelType

load_dotenv()


def main() -> None:
    # 创建模型实例
    model = ModelFactory.create(
        model_platform=ModelPlatformType.OPENAI,
        model_type=ModelType.GPT_4O_MINI,
        model_config_dict={"temperature": 0.7},
    )

    # 定义 Agent 的系统消息（角色设定）
    system_message = BaseMessage.make_assistant_message(
        role_name="Python 编程助手",
        content="你是一名资深的 Python 开发工程师，擅长用简洁的代码解答编程问题。",
    )

    # 创建 ChatAgent
    agent = ChatAgent(system_message=system_message, model=model)

    # 构造用户消息并发起对话
    user_message = BaseMessage.make_user_message(
        role_name="User",
        content="请用一句话介绍 CAMEL 框架，并用 5 行以内代码展示如何打印斐波那契数列前 10 项。",
    )

    response = agent.step(user_message)
    print("=== Agent 回复 ===")
    print(response.msgs[0].content)


if __name__ == "__main__":
    main()
