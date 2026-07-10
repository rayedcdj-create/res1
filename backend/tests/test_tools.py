import json
from app.agent.tools import log_interaction, edit_interaction

def test_log_interaction():
    result_str = log_interaction.invoke({
        "hcp_name": "Dr. Smith",
        "hospital": "City Hospital",
        "interaction_type": "Call",
        "interaction_date": "2024-03-01",
        "interaction_time": "10:00 AM",
        "topics_discussed": "New product launch",
        "sentiment": "Positive",
        "summary": "Good call",
        "outcomes": "Will prescribe",
        "action_items": ["Send brochure"],
        "attendees": ["Dr. Smith", "Rep"]
    })
    
    result = json.loads(result_str)
    assert result["__state_update__"] is True
    assert result["data"]["hcp_name"] == "Dr. Smith"
    assert result["data"]["action_items"] == ["Send brochure"]
    assert result["data"]["attendees"] == ["Dr. Smith", "Rep"]

def test_edit_interaction():
    result_str = edit_interaction.invoke({
        "field": "action_items",
        "value": "Schedule follow up"
    })
    
    result = json.loads(result_str)
    assert result["__state_update__"] is True
    assert result["edit"] is True
    assert result["field"] == "action_items"
    assert result["value"] == "Schedule follow up"
