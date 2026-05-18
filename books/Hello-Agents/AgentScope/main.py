import agentscope
from agentscope.agents import AgentBase, DialogAgent, UserAgent
from agentscope.message import Msg


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


main()
