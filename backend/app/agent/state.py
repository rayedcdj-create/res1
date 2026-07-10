from typing import TypedDict, Annotated, Sequence
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages

class CRMState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    interaction_data: dict
    selected_tool: str
    response: str
