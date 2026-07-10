from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)

class HCP(Base):
    __tablename__ = "hcps"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    specialization = Column(String)
    hospital = Column(String)
    city = Column(String)
    last_visit = Column(String)

class Interaction(Base):
    __tablename__ = "interactions"
    id = Column(Integer, primary_key=True, index=True)
    hcp_id = Column(Integer, ForeignKey("hcps.id"), nullable=True)
    
    hcp_name = Column(String)
    interaction_type = Column(String)
    interaction_date = Column(String)
    interaction_time = Column(String)
    
    attendees = Column(String)
    topics_discussed = Column(Text)
    sentiment = Column(String)
    outcomes = Column(Text)
    summary = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    hcp = relationship("HCP")
    materials = relationship("InteractionMaterial", back_populates="interaction")
    followups = relationship("InteractionFollowup", back_populates="interaction")

class InteractionMaterial(Base):
    __tablename__ = "interaction_materials"
    id = Column(Integer, primary_key=True, index=True)
    interaction_id = Column(Integer, ForeignKey("interactions.id"))
    material_name = Column(String)
    
    interaction = relationship("Interaction", back_populates="materials")

class InteractionFollowup(Base):
    __tablename__ = "interaction_followups"
    id = Column(Integer, primary_key=True, index=True)
    interaction_id = Column(Integer, ForeignKey("interactions.id"))
    action = Column(String)
    due_date = Column(String)
    
    interaction = relationship("Interaction", back_populates="followups")

class ChatHistory(Base):
    __tablename__ = "chat_history"
    id = Column(Integer, primary_key=True, index=True)
    role = Column(String) # 'user' or 'ai'
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
