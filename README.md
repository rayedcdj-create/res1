# AI-First CRM HCP Module

## 1. Project Overview
This project implements an AI-First Customer Relationship Management (CRM) system for Healthcare Professionals (HCP). It features a split-screen interface where users interact with an AI assistant to automatically populate and manage CRM interaction records via conversational input, rather than manual data entry.

## 2. Architecture Diagram
```mermaid
graph TD
    User([User]) --> |Natural Language| UI[React Frontend (Split Screen)]
    UI --> |Redux State| State[Redux Store]
    UI --> |POST /api/chat| Backend[FastAPI Backend]
    
    Backend --> |Invokes| LangGraph[LangGraph Agent]
    LangGraph --> |Uses| Groq[Groq API (Gemma2-9B-it)]
    LangGraph --> |Executes| Tools[Agent Tools]
    
    Tools --> |log_interaction| DB[(PostgreSQL)]
    Tools --> |edit_interaction| DB
    Tools --> |get_hcp_profile| DB
    Tools --> |summarize_interaction| DB
    Tools --> |recommend_next_action| DB
    
    Backend --> |Returns JSON| UI
```

## 3. Frontend Setup
The frontend is built with React, Redux Toolkit, TailwindCSS, and Shadcn UI components.
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## 4. Backend Setup
The backend is powered by FastAPI, LangGraph, and PostgreSQL.
1. `cd backend`
2. `python3 -m venv venv`
3. `source venv/bin/activate`
4. `pip install -r requirements.txt` (or install manually using `pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic pydantic-settings python-dotenv langgraph langchain-groq langchain-core httpx`)
5. Create a `.env` file inside `backend` and add your `GROQ_API_KEY`.
6. Start the backend: `uvicorn app.main:app --reload --port 8000`

## 5. LangGraph Flow
1. User sends a message from the Chat UI.
2. The LangGraph agent receives the message and passes it to the `gemma2-9b-it` model.
3. The LLM decides if it needs to call a tool (e.g., if the user describes a meeting, it calls `log_interaction`).
4. A custom `CRMToolNode` executes the tool and intercepts the output to update the global `CRMState`.
5. The state update is returned to the FastAPI endpoint and sent back to the React frontend to update the Redux store instantly.

## 6. Tool Descriptions
- **Log Interaction**: Extracts structured data (HCP name, sentiment, summary, follow-ups) from natural language.
- **Edit Interaction**: Modifies a specific field in the CRM form without overwriting existing data.
- **HCP Profile Lookup**: Searches and returns a mock HCP profile.
- **Interaction Summary**: Uses the LLM to generate a bulleted summary of the current interaction.
- **Follow-up Recommendation**: Suggests next best actions based on the meeting context.

## 7. Demo Screenshots
*(Add screenshots of the split-screen UI here)*

## 8. Environment Variables
Create a `.env` file in the `backend/` directory:
```env
GROQ_API_KEY="your_groq_api_key_here"
DATABASE_URL="postgresql://crm_user:crm_password@localhost:5432/crm_db"
```
You can use `docker-compose up -d` at the root to run a local PostgreSQL instance.
