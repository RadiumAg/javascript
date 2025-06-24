from openai import OpenAI

client = OpenAI(base_url="https://spark-api-open.xf-yun.com/v2")

client.completions.create(
    model="x1", temperature=0.5, max_tokens=100, prompt="给我花店起个名"
)
