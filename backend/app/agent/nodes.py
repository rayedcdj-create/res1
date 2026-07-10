import os
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import SystemMessage
from .state import CRMState
from .tools import crm_tools
import re

def camel_to_snake(name: str) -> str:
    name = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', name).lower()

# Initialize the LLM
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY", "dummy_key")
)

# Bind tools to the LLM
llm_with_tools = llm.bind_tools(crm_tools)

def assistant_node(state: CRMState):
    """
    Node to process user messages and decide whether to call a tool or respond.
    """
    messages = state.get("messages", [])
    
    # Prepend a system message if one doesn't exist
    if not messages or not isinstance(messages[0], SystemMessage):
        current_data = state.get("interaction_data", {})
        
        # Translate context to snake_case so the LLM doesn't get confused by camelCase
        snake_case_data = {camel_to_snake(k): v for k, v in current_data.items()}
        
        sys_msg = SystemMessage(content=(
            "You are an AI-first CRM assistant for Healthcare Professional (HCP) interactions. "
            "Your job is to help pharmaceutical sales representatives log and manage their meetings with HCPs. "
            "When the user describes a meeting, use the log_interaction tool. "
            "When the user asks to change a field, use the edit_interaction tool. "
            "When asked to summarize the interaction, use the summarize_interaction tool. "
            "When asked for recommendations or follow-up actions, use the recommend_next_action tool.\n"
            "CRITICAL: Do NOT expose raw JSON, dictionaries, or data structures to the user in your messages. Keep your responses conversational.\n\n"
            f"CURRENT FORM DATA:\n{snake_case_data}\n\n"
            "Always be helpful, professional, and concise."
        ))
        messages = [sys_msg] + list(messages)

    response = llm_with_tools.invoke(messages)
    
    return {"messages": [response]}
