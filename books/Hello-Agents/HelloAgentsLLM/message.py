"""消息系统"""
from typing import Option, Dict, Any, Literal
from datetime import date, datetime
from pydantic import BaseModel

# 定义消息角色的限制，限制其取值
MessageRole = Literal["user", "assistant", "system", "tool"]


class Message(BaseModel):
    """消息类"""
    content: str
    role: MessageRole
    timestamp: datetime = None
    metadata: Option[Dict[str, Any]] = None

    def __init__(self, content: str, role: MessageRole, **kwargs: Any) -> None:
        super().__init__(content,
                         role=role,
                         timestap=kwargs.get("timestamp", datetime.now()),
                         metadata=kwargs.get("metadata", {})
                         )

    def to_dict(self) -> Dict[str, Any]:
        """转换为字典格式（OpenAI API格式）"""
        return {
            "role": self.role,
            "content": self.content
        }

    def __str__(self) -> str:
        return f"[{self.role}] {self.content}"
