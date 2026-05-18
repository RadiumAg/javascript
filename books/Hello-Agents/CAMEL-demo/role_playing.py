"""
CAMEL 角色扮演（Role-Playing）多 Agent Demo
通过 RolePlaying 让 AI User 与 AI Assistant 协作完成任务。
"""

from dotenv import load_dotenv

from camel.societies import RolePlaying
from camel.models import ModelFactory
from camel.types import ModelPlatformType, ModelType, TaskType
from camel.configs import ChatGPTConfig

load_dotenv()


def main() -> None:
    task_prompt = "为一个面向初学者的 Python 学习网站设计一个一周的内容更新计划。"

    model = ModelFactory.create(
        model_platform=ModelPlatformType.OPENAI,
        model_type=ModelType.GPT_4O_MINI,
        model_config_dict=ChatGPTConfig(temperature=0.7).as_dict(),
    )

    role_play_session = RolePlaying(
        assistant_role_name="Python 教程作者",
        assistant_agent_kwargs={"model": model},
        user_role_name="产品经理",
        user_agent_kwargs={"model": model},
        task_prompt=task_prompt,
        with_task_specify=True,
        task_specify_agent_kwargs={"model": model},
        task_type=TaskType.AI_SOCIETY,
    )

    print("=== 原始任务 ===")
    print(task_prompt)
    print("\n=== 细化后任务 ===")
    print(role_play_session.specified_task_prompt)

    chat_turn_limit, n = 6, 0
    input_msg = role_play_session.init_chat()

    while n < chat_turn_limit:
        n += 1
        assistant_response, user_response = role_play_session.step(input_msg)

        if assistant_response.terminated or user_response.terminated:
            print("会话终止。")
            break

        print(f"\n--- 第 {n} 轮 ---")
        print(f"[User -> Assistant]\n{user_response.msg.content}\n")
        print(f"[Assistant -> User]\n{assistant_response.msg.content}\n")

        if "CAMEL_TASK_DONE" in user_response.msg.content:
            print("任务完成！")
            break

        input_msg = assistant_response.msg


if __name__ == "__main__":
    main()
