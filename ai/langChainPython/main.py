import os

os.environ["OPENAI_API_KEY"] = "你的Open API Key"
from langchain.llms import OpenAI

llm = OpenAI(
    model="x1",
    temperature=0.8,
    max_tokens=60,
)
response = llm.predict("请给我的花店起个名")
print(response)
