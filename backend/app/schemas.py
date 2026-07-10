from pydantic import BaseModel
from typing import List, Optional

class ChatRequest(BaseModel):
    message: str
    context: Optional[dict] = None
    
class InteractionResponse(BaseModel):
    id: int
    hcp_id: Optional[int]
    hcp_name: Optional[str]
    interaction_type: Optional[str]
    interaction_date: Optional[str]
    interaction_time: Optional[str]
    attendees: Optional[str]
    topics_discussed: Optional[str]
    sentiment: Optional[str]
    outcomes: Optional[str]
    summary: Optional[str]

class ChatResponse(BaseModel):
    response: str
    interaction_data: Optional[dict] = None
