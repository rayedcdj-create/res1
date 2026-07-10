from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import ChatRequest, ChatResponse
from ..agent.graph import crm_graph
from langchain_core.messages import HumanMessage

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest, db: Session = Depends(get_db)):
    try:
        # Pass user message to LangGraph agent
        messages = [HumanMessage(content=request.message)]
        
        # We need a state dict to start
        initial_state = {
            "messages": messages,
            "interaction_data": request.context or {},
            "selected_tool": "",
            "response": ""
        }
        
        # Invoke graph
        result = crm_graph.invoke(initial_state)
        
        # Extract the final AI response and interaction data updates
        final_message = result["messages"][-1].content
        interaction_data = result.get("interaction_data", {})
        
        return ChatResponse(
            response=final_message,
            interaction_data=interaction_data if interaction_data else None
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/hcp/search")
async def search_hcp(query: str, db: Session = Depends(get_db)):
    # Placeholder for HCP search
    return {"status": "success", "data": []}
