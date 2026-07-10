from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import ToolNode, tools_condition
from langchain_core.messages import ToolMessage
from .state import CRMState
from .nodes import assistant_node
from .tools import crm_tools
import json
import os
import re

def camel_to_snake(name: str) -> str:
    name = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', name).lower()

class CRMToolNode(ToolNode):
    """Custom ToolNode to update CRMState with interaction data and selected tool."""
    def _modify_state(self, state: CRMState, result: list) -> dict:
        # result is a list of ToolMessages returned by the base ToolNode
        updates = {"messages": result}
        
        if result:
            last_message = result[-1]
            if isinstance(last_message, ToolMessage):
                updates["selected_tool"] = last_message.name
                try:
                    content = json.loads(last_message.content)
                    if isinstance(content, dict) and content.get("__state_update__"):
                        # Extract data from tool
                        if content.get("edit"):
                            # It's an edit action
                            current_data = state.get("interaction_data", {})
                            field_name = camel_to_snake(content["field"])
                            current_data[field_name] = content["value"]
                            updates["interaction_data"] = current_data
                        else:
                            # It's a log action, replacing/merging data
                            current_data = state.get("interaction_data", {})
                            current_data.update(content.get("data", {}))
                            updates["interaction_data"] = current_data
                except json.JSONDecodeError:
                    pass
        
        return updates

    def invoke(self, state: CRMState, config=None, **kwargs):
        # Call the parent class invoke to get the ToolMessages
        result = super().invoke(state, config, **kwargs)
        # Apply our custom state updates
        return self._modify_state(state, result.get("messages", []))


def build_graph():
    builder = StateGraph(CRMState)
    
    # Add nodes
    builder.add_node("assistant", assistant_node)
    builder.add_node("tools", CRMToolNode(crm_tools))
    
    # Add edges
    builder.add_edge(START, "assistant")
    
    # Conditional routing based on tool call
    builder.add_conditional_edges(
        "assistant",
        tools_condition,
    )
    
    builder.add_edge("tools", "assistant")
    
    graph = builder.compile()
    return graph

crm_graph = build_graph()
