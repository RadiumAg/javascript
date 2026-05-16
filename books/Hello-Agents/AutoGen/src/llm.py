import os
from dotenv import load_dotenv
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_core.models import ModelInfo, ModelFamily

load_dotenv()

model_client = OpenAIChatCompletionClient(
    model="mimo-v2.5",
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://token-plan-cn.xiaomimimo.com/v1",
    model_info=ModelInfo(
        vision=False,
        function_calling=True,
        json_output=True,
        family=ModelFamily.UNKNOWN,
        structured_output=False,
    ),
)

__all__ = ["model_client"]