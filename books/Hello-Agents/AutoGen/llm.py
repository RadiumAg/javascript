import os
from dotenv import load_dotenv
from autogen_ext.models.openai import OpenAIChatCompletionClient

load_dotenv()

model_client = OpenAIChatCompletionClient(
    model="mimo-v2.5",
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://token-plan-cn.xiaomimimo.com/v1",
)

__all__ = ["model_client"]