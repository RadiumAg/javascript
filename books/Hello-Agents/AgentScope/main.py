"""
三国狼人杀 - 基于 AgentScope 0.1.6 的多 Agent 对话式游戏

角色分配:
  - 狼人(2): 孙权、周瑜
  - 预言家(1): 曹操
  - 女巫(1): 张飞
  - 平民(2): 司马懿、赵云
"""

import os
import json
import random
from copy import deepcopy
from typing import Optional, List, Dict
from dotenv import load_dotenv
from pydantic import BaseModel, Field

import agentscope
from agentscope.agents import AgentBase, DialogAgent
from agentscope.message import Msg
from agentscope.msghub import msghub

load_dotenv()

# ============================
# 常量
# ============================
MAX_DISCUSSION_ROUND = 3
MAX_GAME_ROUNDS = 3

MODEL_CONFIG_NAME = "mimo"

# 角色定义
ROLES = {
    "孙权": "狼人",
    "周瑜": "狼人",
    "曹操": "预言家",
    "张飞": "女巫",
    "司马懿": "平民",
    "赵云": "平民",
}

# 三国人物性格
CHARACTERS = {
    "孙权": "沉稳大气,善于权衡利弊,说话有帝王之气",
    "周瑜": "才华横溢但心思缜密,善于分析局势,偶尔锋芒毕露",
    "曹操": "老谋深算,疑心重,说话霸气但暗藏玄机",
    "张飞": "粗犷直爽,嫉恶如仇,说话直来直去",
    "司马懿": "城府极深,善于隐忍,话不多但句句有深意",
    "赵云": "忠义正直,冷静沉着,分析有条理",
}


# ============================
# Pydantic 结构化输出模型
# ============================
class DiscussionModel(BaseModel):
    """讨论阶段的输出"""
    thought: str = Field(description="你的想法和分析")


class VoteModel(BaseModel):
    """投票选择"""
    target: str = Field(description="你选择的目标玩家姓名")
    reason: str = Field(description="你的理由")


class WitchActionModel(BaseModel):
    """女巫行动"""
    use_antidote: bool = Field(description="是否使用解药", default=False)
    use_poison: bool = Field(description="是否使用毒药", default=False)
    poison_target: Optional[str] = Field(description="毒药目标玩家", default=None)


# ============================
# 辅助函数
# ============================
def get_role_prompt(name: str, role: str, character_desc: str, alive_players: List[str]) -> str:
    """生成角色的系统提示词"""
    base = f"""你是{name}，在这场三国狼人杀游戏中扮演{role}。

你的性格: {character_desc}

游戏规则:
1. 你只能通过对话和推理参与游戏
2. 不要尝试调用任何外部工具或函数
3. 回复时保持角色性格，用简短的几句话表达你的观点
4. 不要暴露自己是AI，要像真实的三国人物一样说话

当前存活玩家: {', '.join(alive_players)}
"""

    if role == "狼人":
        base += """
角色能力:
- 你是狼人阵营，目标是消灭所有好人
- 夜晚可以与其他狼人协商击杀目标
- 白天要隐藏身份，误导好人投票
- 绝对不要在白天暴露自己是狼人
"""
    elif role == "预言家":
        base += """
角色能力:
- 你是好人阵营的预言家，每晚可以查验一名玩家的身份
- 你知道的信息要有策略地分享，不要轻易暴露自己是预言家
- 适当的时候可以跳出来引导投票
"""
    elif role == "女巫":
        base += """
角色能力:
- 你是好人阵营的女巫，有一瓶解药和一瓶毒药
- 解药可以救活被狼人杀害的玩家
- 毒药可以杀死一名你怀疑的玩家
- 每种药只能用一次
"""
    else:
        base += """
角色能力:
- 你是好人阵营的平民，没有特殊能力
- 通过观察发言和行为来推理谁是狼人
- 白天投票淘汰你怀疑的玩家
"""
    return base


def format_player_list(players: List[str]) -> str:
    return "、".join(players)


def parse_json_from_content(content: str) -> Optional[dict]:
    """从 Agent 回复中解析 JSON"""
    try:
        # 尝试直接解析
        return json.loads(content)
    except (json.JSONDecodeError, TypeError):
        pass
    # 尝试从 markdown 代码块中提取
    if "```" in str(content):
        parts = str(content).split("```")
        for part in parts:
            part = part.strip()
            if part.startswith("json"):
                part = part[4:].strip()
            try:
                return json.loads(part)
            except (json.JSONDecodeError, TypeError):
                continue
    return None


def extract_vote_target(content: str, alive_players: List[str]) -> Optional[str]:
    """从回复内容中提取投票目标"""
    # 先尝试 JSON
    data = parse_json_from_content(content)
    if data and "target" in data:
        if data["target"] in alive_players:
            return data["target"]

    # 回退: 在文本中查找玩家名字
    content_str = str(content)
    for player in alive_players:
        if player in content_str:
            return player
    return None


def count_votes(votes: Dict[str, str]) -> Optional[str]:
    """统计投票结果, 返回票数最高的玩家"""
    if not votes:
        return None
    vote_count: Dict[str, int] = {}
    for target in votes.values():
        vote_count[target] = vote_count.get(target, 0) + 1

    max_votes = max(vote_count.values())
    candidates = [p for p, c in vote_count.items() if c == max_votes]
    return random.choice(candidates)


# ============================
# 主持人 Agent
# ============================
class ModeratorAgent:
    """游戏主持人 (不需要 LLM, 纯逻辑驱动)"""

    def __init__(self):
        self.name = "游戏主持人"

    def announce(self, text: str) -> Msg:
        msg = Msg(name=self.name, content=f"📢 {text}", role="assistant")
        print(f"{self.name}: {msg.content}")
        return msg


# ============================
# 三国狼人杀游戏
# ============================
class WerewolfGame:
    def __init__(self):
        self.moderator = ModeratorAgent()
        self.alive_players: List[str] = list(ROLES.keys())
        self.dead_players: List[str] = []
        self.agents: Dict[str, DialogAgent] = {}
        self.werewolves: List[str] = []
        self.seer: Optional[str] = None
        self.witch: Optional[str] = None
        self.villagers: List[str] = []

        # 女巫道具
        self.antidote_used = False
        self.poison_used = False

        # 预言家查验记录
        self.seer_results: Dict[str, str] = {}

        # 分类角色
        for name, role in ROLES.items():
            if role == "狼人":
                self.werewolves.append(name)
            elif role == "预言家":
                self.seer = name
            elif role == "女巫":
                self.witch = name
            else:
                self.villagers.append(name)

    def init_agents(self):
        """初始化所有 Agent"""
        print("\n=== 游戏初始化 ===")
        for name, role in ROLES.items():
            sys_prompt = get_role_prompt(
                name, role, CHARACTERS[name], self.alive_players)
            agent = DialogAgent(
                name=name,
                sys_prompt=sys_prompt,
                model_config_name=MODEL_CONFIG_NAME,
                use_memory=True,
            )
            self.agents[name] = agent
            self.moderator.announce(
                f"【{name}】你在这场三国狼人杀中扮演{role}，你的角色是{name}。"
                + ("夜晚可以击杀一名玩家" if role == "狼人" else
                   "每晚可以查验一名玩家" if role == "预言家" else
                   "拥有解药和毒药各一瓶" if role == "女巫" else
                   "通过推理找出狼人")
            )

        self.moderator.announce(
            f"三国狼人杀游戏开始！参与者：{format_player_list(self.alive_players)}"
        )
        print(f"✅ 游戏设置完成，共{len(self.alive_players)}名玩家\n")

    def get_alive_agents(self, names: List[str]) -> List[DialogAgent]:
        """获取存活的 Agent 列表"""
        return [self.agents[n] for n in names if n in self.alive_players]

    def eliminate_player(self, name: str, cause: str) -> None:
        """淘汰玩家"""
        if name in self.alive_players:
            self.alive_players.remove(name)
            self.dead_players.append(name)
            print(f"💀 {name}（{ROLES[name]}）被{cause}淘汰！")

    def check_game_over(self) -> Optional[str]:
        """检查游戏是否结束"""
        alive_wolves = [p for p in self.alive_players if ROLES[p] == "狼人"]
        alive_good = [p for p in self.alive_players if ROLES[p] != "狼人"]

        if not alive_wolves:
            return "good"  # 好人胜利
        if len(alive_wolves) >= len(alive_good):
            return "wolf"  # 狼人胜利
        return None

    # ---- 夜晚阶段 ----

    def werewolf_phase(self) -> Optional[str]:
        """狼人讨论并选择击杀目标"""
        print("\n【狼人阶段】")
        self.moderator.announce("🐺 狼人请睁眼，选择今晚要击杀的目标...")

        alive_wolves = [w for w in self.werewolves if w in self.alive_players]
        if not alive_wolves:
            return None

        # 狼人讨论
        wolf_agents = self.get_alive_agents(alive_wolves)
        discuss_msg = self.moderator.announce(
            f"狼人们，请讨论今晚的击杀目标。存活玩家：{format_player_list(self.alive_players)}"
        )

        with msghub(participants=wolf_agents, announcement=discuss_msg) as hub:
            for round_i in range(MAX_DISCUSSION_ROUND):
                for wolf_agent in wolf_agents:
                    response = wolf_agent()
                    print(f"{wolf_agent.name}: {response.content}")

        # 投票
        vote_msg = self.moderator.announce("请选择击杀目标")
        non_wolf_alive = [
            p for p in self.alive_players if p not in alive_wolves]
        votes: Dict[str, str] = {}

        for wolf_name in alive_wolves:
            wolf_agent = self.agents[wolf_name]
            vote_prompt = Msg(
                name="system",
                content=f"请从以下玩家中选择一个击杀目标: {format_player_list(non_wolf_alive)}。"
                        f"只需要回复目标的名字。",
                role="user",
            )
            result = wolf_agent(vote_prompt)
            target = extract_vote_target(result.content, non_wolf_alive)
            if target:
                votes[wolf_name] = target
                print(f"{wolf_name}: {result.content}")
            else:
                # 随机选一个
                target = random.choice(non_wolf_alive)
                votes[wolf_name] = target
                print(f"{wolf_name}: 我选择{target}。")

        killed = count_votes(votes)
        return killed

    def seer_phase(self, killed_player: Optional[str]) -> None:
        """预言家查验阶段"""
        if not self.seer or self.seer not in self.alive_players:
            return

        print("\n【预言家阶段】")
        self.moderator.announce("🔮 预言家请睁眼，选择要查验的玩家...")

        seer_agent = self.agents[self.seer]
        others = [p for p in self.alive_players if p != self.seer]
        check_prompt = Msg(
            name="system",
            content=f"你是预言家，请选择一名玩家查验身份。可选: {format_player_list(others)}。"
                    f"只需回复要查验的玩家名字。",
            role="user",
        )
        result = seer_agent(check_prompt)
        target = extract_vote_target(result.content, others)
        if not target:
            target = random.choice(others)

        print(f"{self.seer}: 我要查验{target}。")

        # 告知查验结果
        actual_role = ROLES[target]
        is_wolf = "狼人" if actual_role == "狼人" else "好人"
        self.seer_results[target] = is_wolf

        result_msg = Msg(
            name="system",
            content=f"查验结果：{target}是{is_wolf}",
            role="user",
        )
        seer_agent.observe(result_msg)
        self.moderator.announce(f"查验结果：{target}是{is_wolf}")

    def witch_phase(self, killed_player: Optional[str]) -> Optional[str]:
        """女巫阶段，返回被毒杀的玩家名"""
        if not self.witch or self.witch not in self.alive_players:
            return None

        print("\n【女巫阶段】")
        self.moderator.announce("🧙‍♀️ 女巫请睁眼...")

        witch_agent = self.agents[self.witch]
        poisoned = None

        # 解药
        if killed_player and not self.antidote_used:
            self.moderator.announce(f"今晚{killed_player}被狼人击杀")
            save_prompt = Msg(
                name="system",
                content=f"今晚{killed_player}被狼人杀了。你有解药，是否使用？"
                        f"回复'是'表示使用解药救人，回复'否'表示不使用。",
                role="user",
            )
            result = witch_agent(save_prompt)
            content = str(result.content)
            print(f"{self.witch}: {content}")

            if "是" in content or "使用" in content or "救" in content:
                self.antidote_used = True
                self.moderator.announce(f"你使用解药救了{killed_player}")
                killed_player = None  # 被救活

        # 毒药
        if not self.poison_used:
            others = [p for p in self.alive_players if p != self.witch]
            poison_prompt = Msg(
                name="system",
                content=f"你还有毒药，是否使用？可选目标: {format_player_list(others)}。"
                        f"回复'否'不使用，或回复要毒的玩家名字。",
                role="user",
            )
            result = witch_agent(poison_prompt)
            content = str(result.content)

            if "否" not in content and "不" not in content:
                target = extract_vote_target(content, others)
                if target:
                    self.poison_used = True
                    poisoned = target
                    print(f"{self.witch}: 我使用毒药毒杀{target}。")

        return killed_player  # 返回 None 表示被救, 否则返回被杀者名

    # ---- 白天阶段 ----

    def day_discussion(self, round_num: int) -> None:
        """白天讨论阶段"""
        print("\n【白天讨论阶段】")
        self.moderator.announce(f"☀️ 第{round_num}天天亮了，请大家睁眼...")
        discuss_msg = self.moderator.announce(
            f"现在开始自由讨论。存活玩家：{format_player_list(self.alive_players)}"
        )

        alive_agents = self.get_alive_agents(self.alive_players)
        with msghub(participants=alive_agents, announcement=discuss_msg) as hub:
            for agent in alive_agents:
                response = agent()
                print(f"\n{agent.name}: {response.content}")

    def day_vote(self) -> Optional[str]:
        """白天投票阶段"""
        print("\n【投票阶段】")
        self.moderator.announce("请投票选择要淘汰的玩家")

        votes: Dict[str, str] = {}
        for player_name in self.alive_players:
            agent = self.agents[player_name]
            others = [p for p in self.alive_players if p != player_name]
            vote_prompt = Msg(
                name="system",
                content=f"现在进行投票。请从以下玩家中选择一个你认为是狼人的人投票淘汰: "
                        f"{format_player_list(others)}。只需回复你投票的玩家名字和简短理由。",
                role="user",
            )
            result = agent(vote_prompt)
            target = extract_vote_target(result.content, others)
            if target:
                votes[player_name] = target
            else:
                target = random.choice(others)
                votes[player_name] = target

            print(f"\n{player_name}: {result.content}")

        # 统计
        eliminated = count_votes(votes)
        print(f"\n📊 投票结果: {votes}")
        return eliminated

    # ---- 游戏主循环 ----

    def play_round(self, round_num: int) -> Optional[str]:
        """执行一轮游戏"""
        print(f"\n{'='*40}")
        print(f"=== 第{round_num}轮游戏 ===")
        print(f"{'='*40}")
        print(f"🌙 第{round_num}夜降临，天黑请闭眼...")

        # 1. 狼人阶段
        killed = self.werewolf_phase()

        # 2. 预言家阶段
        self.seer_phase(killed)

        # 3. 女巫阶段
        killed = self.witch_phase(killed)

        # 结算夜晚
        if killed:
            self.moderator.announce(f"昨夜{killed}被杀害。")
            self.eliminate_player(killed, "夜晚袭击")
        else:
            self.moderator.announce("昨夜平安无事，无人死亡。")

        # 检查胜负
        result = self.check_game_over()
        if result:
            return result

        # 4. 白天讨论
        self.day_discussion(round_num)

        # 5. 投票淘汰
        eliminated = self.day_vote()
        if eliminated:
            self.moderator.announce(f"投票结果：{eliminated}被淘汰！")
            self.eliminate_player(eliminated, "投票")

        # 检查胜负
        return self.check_game_over()

    def run(self):
        """运行游戏"""
        print("🎮 欢迎来到三国狼人杀！\n")
        self.init_agents()

        for round_num in range(1, MAX_GAME_ROUNDS + 1):
            result = self.play_round(round_num)
            if result:
                break
        else:
            # 达到最大轮数
            result = self.check_game_over() or "draw"

        # 游戏结束
        print(f"\n{'='*40}")
        print("🏁 游戏结束！")
        if result == "good":
            print("🎉 好人阵营胜利！所有狼人已被消灭！")
        elif result == "wolf":
            print("🐺 狼人阵营胜利！狼人数量已占多数！")
        else:
            print("⏰ 游戏时间到，平局！")

        print(f"\n角色揭晓:")
        for name, role in ROLES.items():
            status = "存活" if name in self.alive_players else "死亡"
            print(f"  {name}: {role} ({status})")


# ============================
# 入口
# ============================
def main():
    # 初始化 AgentScope
    agentscope.init(
        model_configs={
            "config_name": MODEL_CONFIG_NAME,
            "model_type": "openai_chat",
            "model_name": "mimo-v2.5-pro",
            "api_key": os.environ.get("OPENAI_API_KEY"),
            "client_args": {
                "base_url": os.environ.get("OPENAI_BASE_URL"),
            },
        },
        disable_saving=True,
        logger_level="WARNING",
    )

    game = WerewolfGame()
    game.run()


if __name__ == "__main__":
    main()
