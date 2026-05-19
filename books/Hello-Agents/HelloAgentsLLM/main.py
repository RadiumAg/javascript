"""
HelloAgentsLLM - LLM 基础调用示例
"""
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()


def call_llm(messages: list[dict]) -> str:
    """调用大语言模型"""
    client = OpenAI(
        api_key=os.getenv("OPENAI_API_KEY"),
        base_url=os.getenv("OPENAI_BASE_URL"),
    )

    response = client.chat.completions.create(
        model=os.getenv("MODEL_NAME", "mimo-v2.5-pro"),
        messages=messages,
    )

    return response.choices[0].message.content


def main():
    messages = [
        {"role": "system", "content": "你是一个友好的AI助手。"},
        {"role": "user", "content": "你好，请用一句话介绍你自己。"},
    ]

    print("正在调用大模型...")
    result = call_llm(messages)
    print(f"\n🤖 回复: {result}")


if __name__ == "__main__":
    main()
