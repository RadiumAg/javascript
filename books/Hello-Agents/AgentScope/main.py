from agentscope.agents import AgentBase, DialogAgent, UserAgent
from agentscope.message import Msg
from agentscope.pipeline import fanout_pipeline, MsgHub
from pydantic import BaseModel, Field
from typing import Optional
import asyncio


async def main():
    message = Msg(name="Alicen",
                  content="Hello,Bob",
                  role="user",
                  metadata={
                      "timestamp": "2024-01-15T10:30:00Z",
                      "message_type": "text",
                      "priority": "normal"
                  })

    # 并行收集所有玩家的投票决策
    vote_msgs = await fanout_pipeline(
        self.alive_players,
        await self.moderator.announce("请投票选择要淘汰的玩家"),
        structured_model=get_vote_model_cn(self.alive_players),
        enable_gather=False,
    )

    try:
        response = await wolf(
            "请分析当前局势并表达你的观点。",
            structured_model=DiscussionModelCN
        )
    except Exception as e:
        print(f"⚠️ {wolf.name} 讨论时出错: {e}")
    # 创建默认响应，确保游戏继续进行
    default_response = DiscussionModelCN(
        reach_agreement=False,
        confidence_level=5,
        key_evidence="暂时无法分析"
    )


class WerewolfGame:
    # ... 类属性和 __init__ 在此定义 ...

    async def werewolf_phase(self, round_num: int):
        """狼人阶段 - 展示消息驱动的写作模式"""
        if (not self.warewolves):
            return None

        async with MsgHub(self.warewolves,
                          enable_auto_broadcast=True,
                          announcement=await self.moderator.announce(
                              f"狼人们，请讨论今晚的击杀目标。存活玩家：{format_player_list(self.alive_players)}")
                          ) as warewolves_hub:

            for _ in range(MAX_DISCUSSION_ROUND):
                for wolf in self.warewolves:
                    await wolf(structured_model=DiscussionModelCN)
            # 投票阶段：收集并统计狼人的击杀决策
            warewolves_hub.set_auto_broadcast(False)

            kill_votes = await fanout_pipeline(
                self.werewolves,
                msg=await self.moderator.announce("请选择击杀目标"),
                structured_model=WerewolfKillModelCN,
                enable_gather=False,
            )


class CustomAgent(AgentBase):
    def __init__(self, name: str, **kwargs):
        super().__init__(name=name, **kwargs)

    def reply(self, x: Msg) -> Msg:
        response = self.model(x.content)
        return response

    def observe(self, x: Msg) -> None:
        self.memory.add(x)


class DiscussionModelCN(BaseModel):
    """讨论阶段的输出格式"""
    reach_agreement: bool = Field(
        description="是否已达成一致意见",
        default=False
    )

    confidence_level: int = Field(
        description="对当前推理的信心程度(1-10)",
        ge=1, le=10,
        default=5
    )

    key_evidence: Optional[str] = Field(
        description="支持你观点的关键证据",
        default=None
    )


class WitchActionModelCN(BaseModel):
    """女巫行动的输出格式"""
    use_antidote: bool = Field(description="是否使用解药")
    use_poison: bool = Field(description="是否使用毒药")
    target_name: Optional[str] = Field(description="毒药目标玩家姓名")


def get_role_prompt(role: str, character: str) -> str:
    """获取角色提示词 - 融合游戏规则与人物性格"""
    base_prompt = f"""你是{character}，在这场三国狼人杀游戏中扮演{role}。

重要规则：
1. 你只能通过对话和推理参与游戏
2. 不要尝试调用任何外部工具或函数
3. 严格按照要求的JSON格式回复

角色特点：
"""
    if role == "狼人":
        return base_prompt + f"""
- 你是狼人阵营，目标是消灭所有好人
- 夜晚可以与其他狼人协商击杀目标
- 白天要隐藏身份，误导好人
- 以{character}的性格说话和行动
"""


if __name__ == "__main__":
    asyncio.run(main())
