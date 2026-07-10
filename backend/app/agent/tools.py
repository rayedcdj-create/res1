import json
import os
from typing import Any
from langchain_core.tools import tool
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate

# Initialize a separate LLM instance for tool extraction if needed
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY", "dummy_key")
)

@tool
def log_interaction(
    hcp_name: str, 
    hospital: str, 
    interaction_type: str, 
    interaction_date: str, 
    interaction_time: str,
    topics_discussed: str,
    sentiment: str, 
    summary: str, 
    outcomes: str,
    action_items: list[str],
    attendees: list[str] = None
) -> str:
    """
    Convert natural language into structured CRM data.
    Use this tool when the user describes a new interaction or meeting to log.
    Extract the details from the user's message and pass them as arguments.
    IMPORTANT: action_items and attendees MUST be arrays/lists of strings, even if there is only one item.
    Leave unknown fields as empty strings or empty arrays.
    """
    data = {
        "hcp_name": hcp_name,
        "hospital": hospital,
        "interaction_type": interaction_type,
        "interaction_date": interaction_date,
        "interaction_time": interaction_time,
        "topics_discussed": topics_discussed,
        "sentiment": sentiment,
        "summary": summary,
        "outcomes": outcomes,
        "action_items": action_items,
        "attendees": attendees if attendees else []
    }
    return json.dumps({"__state_update__": True, "data": data})

@tool
def edit_interaction(field: str, value: Any) -> str:
    """
    Modify specific fields in the current interaction record.
    Use this when the user corrects or updates previously logged data.
    Provide the exact field name (e.g., 'action_items', 'sentiment', 'interaction_date') and the new value.
    """
    return json.dumps({
        "__state_update__": True,
        "edit": True,
        "field": field,
        "value": value
    })

@tool
def get_hcp_profile(hcp_name: str) -> str:
    """
    Retrieve existing HCP (Healthcare Professional) details from the database.
    Use this when the user asks for information or profile of an HCP.
    """
    # Mocking DB retrieval for the UI
    profile = {
        "hcp_name": hcp_name,
        "specialization": "Endocrinology",
        "hospital": "Apollo Hospital",
        "city": "Mumbai",
        "last_visit": "15 June"
    }
    return json.dumps(profile)

@tool
def summarize_interaction(summary: str) -> str:
    """
    Generate a bulleted summary of the current interaction context.
    Use this when the user asks you to summarize the interaction or meeting.
    The summary parameter should contain the text you generated for the summary.
    """
    return json.dumps({
        "__state_update__": True,
        "edit": True,
        "field": "summary",
        "value": summary
    })

@tool
def recommend_next_action(recommendations: list[str]) -> str:
    """
    Evaluate the context and suggest follow-ups.
    Use this when the user asks for recommendations, next steps, or follow-up actions.
    Provide the suggested actions as a list of strings in the 'recommendations' parameter.
    """
    return json.dumps({
        "__state_update__": True,
        "edit": True,
        "field": "action_items",
        "value": recommendations
    })

crm_tools = [
    log_interaction,
    edit_interaction,
    get_hcp_profile,
    summarize_interaction,
    recommend_next_action
]
