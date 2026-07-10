import json
from langchain_core.messages import ToolMessage
from app.agent.graph import CRMToolNode
from app.agent.tools import crm_tools

def test_crm_tool_node_log_action():
    node = CRMToolNode(crm_tools)
    
    # Simulate the tool returning a log action
    tool_output = json.dumps({
        "__state_update__": True,
        "data": {"hcp_name": "Dr. Strange", "hospital": "Sanctum"}
    })
    
    tool_msg = ToolMessage(content=tool_output, name="log_interaction", tool_call_id="123")
    
    # Current state is empty
    initial_state = {"messages": [], "interaction_data": {}}
    
    updates = node._modify_state(initial_state, [tool_msg])
    
    assert updates["selected_tool"] == "log_interaction"
    assert updates["interaction_data"]["hcp_name"] == "Dr. Strange"

def test_crm_tool_node_edit_action():
    node = CRMToolNode(crm_tools)
    
    tool_output = json.dumps({
        "__state_update__": True,
        "edit": True,
        "field": "sentiment",
        "value": "Positive"
    })
    
    tool_msg = ToolMessage(content=tool_output, name="edit_interaction", tool_call_id="456")
    
    # Current state has existing data
    initial_state = {
        "messages": [], 
        "interaction_data": {"hcp_name": "Dr. Strange", "sentiment": "Neutral"}
    }
    
    updates = node._modify_state(initial_state, [tool_msg])
    
    assert updates["selected_tool"] == "edit_interaction"
    assert updates["interaction_data"]["hcp_name"] == "Dr. Strange" # Unchanged
    assert updates["interaction_data"]["sentiment"] == "Positive" # Edited
