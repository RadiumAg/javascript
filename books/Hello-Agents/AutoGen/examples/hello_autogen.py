"""
Hello AutoGen - A simple two-agent conversation example.

This example demonstrates:
1. How to create an AssistantAgent with LLM backend
2. How to create a UserProxyAgent that simulates a human
3. How to initiate a chat between them

Before running:
1. Set your OpenAI API key: export OPENAI_API_KEY="sk-..."
2. Or create a .env file with OPENAI_API_KEY=sk-...
"""

import asyncio
import os

from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.ui import Console
from autogen_ext.models.openai import OpenAIChatCompletionClient


async def main() -> None:
    # Step 1: Create an OpenAI model client
    model_client = OpenAIChatCompletionClient(
        model="gpt-4o",
        api_key=os.environ.get("OPENAI_API_KEY"),
    )

    # Step 2: Create agents
    assistant = AssistantAgent(
        name="assistant",
        model_client=model_client,
        system_message="You are a helpful AI assistant. Keep your responses concise.",
    )

    user_proxy = AssistantAgent(
        name="user_proxy",
        model_client=model_client,
        system_message="You are a user with a question. Ask the assistant something interesting.",
    )

    # Step 3: Create a team with both agents
    team = RoundRobinGroupChat(
        participants=[assistant, user_proxy],
        max_turns=4,  # Limit conversation turns
    )

    # Step 4: Start the conversation
    task = "Ask the assistant: What is multi-agent AI and why is it useful?"
    print(f"\n{'='*60}")
    print(f"Starting task: {task}")
    print(f"{'='*60}\n")

    stream = team.run_stream(task=task)
    await Console(stream)


if __name__ == "__main__":
    asyncio.run(main())
