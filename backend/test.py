import os
from dotenv import load_dotenv
load_dotenv()
from langchain_groq import ChatGroq
from langchain_core.tools import tool

@tool
def log_interaction(text: str) -> str:
    """Log an interaction"""
    return "Logged"

llm = ChatGroq(model="llama-3.3-70b-versatile", api_key=os.environ.get("GROQ_API_KEY")).bind_tools([log_interaction])
response = llm.invoke("Log this interaction: I met with Dr. Smith")
print("Response content:", repr(response.content))
print("Tool calls:", response.tool_calls)
