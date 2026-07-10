from unittest.mock import patch
from langchain_core.messages import AIMessage

def test_chat_endpoint_success(client):
    # We mock the graph invocation to avoid hitting the real LLM
    mock_result = {
        "messages": [AIMessage(content="Test response from mocked LLM")],
        "interaction_data": {"hcp_name": "Dr. Test"},
        "selected_tool": "log_interaction"
    }
    
    with patch("app.api.endpoints.crm_graph.invoke", return_value=mock_result):
        response = client.post(
            "/api/chat",
            json={
                "message": "Met Dr. Test",
                "context": {}
            }
        )
        
    assert response.status_code == 200
    data = response.json()
    assert data["response"] == "Test response from mocked LLM"
    assert data["interaction_data"]["hcp_name"] == "Dr. Test"

def test_chat_endpoint_error(client):
    # Test handling of an exception in the graph
    with patch("app.api.endpoints.crm_graph.invoke", side_effect=Exception("API Error")):
        response = client.post(
            "/api/chat",
            json={
                "message": "This will fail",
                "context": {}
            }
        )
        
    assert response.status_code == 500
    assert "API Error" in response.json()["detail"]

def test_hcp_search_endpoint(client):
    response = client.get("/api/hcp/search?query=test")
    assert response.status_code == 200
    assert response.json()["status"] == "success"
