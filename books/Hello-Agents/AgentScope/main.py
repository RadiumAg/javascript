from agentscope.agents import AgentBase, DialogAgent, UserAgent
from agentscope.message import Msg
from pydantic import BaseModel, Field


def main():
    message = Msg(name="Alicen",
                  content="Hello,Bob",
                  role="user",
                  metadata={
                      "timestamp": "2024-01-15T10:30:00Z",
                      "message_type": "text",
                      "priority": "normal"
                  })


class CustomAgent(AgentBase):
    def __init__(self, name: str, **kwargs):
        super().__init__(name=name, **kwargs)

    def reply(self, x: Msg) -> Msg:
        response = self.model(x.content)
        return response

    def observe(self, x: Msg) -> None:
        self.memory.add(x)


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


main()
