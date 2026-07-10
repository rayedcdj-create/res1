import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../redux/store';
import { addMessage } from '../redux/slices/chatSlice';
import { setLoading, setSelectedTool } from '../redux/slices/appSlice';
import { updateInteraction } from '../redux/slices/interactionSlice';
import { Send, Bot, User, Wrench } from 'lucide-react';
import axios from 'axios';

export const ChatPanel: React.FC = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.chat.messages);
  const isLoading = useSelector((state: RootState) => state.app.isLoading);
  const selectedTool = useSelector((state: RootState) => state.app.selectedTool);
  const interaction = useSelector((state: RootState) => state.interaction);
  
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input,
      timestamp: new Date().toISOString()
    };
    
    dispatch(addMessage(userMessage));
    setInput('');
    dispatch(setLoading(true));
    dispatch(setSelectedTool(null));
    
    try {
      // In Phase 5 this connects to the real backend
      // Pass the current interaction state as context so the stateless backend has memory
      const response = await axios.post('http://localhost:8000/api/chat', { 
        message: userMessage.content,
        context: interaction
      });
      
      const data = response.data;
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai' as const,
        content: data.response || "I've processed your request.",
        timestamp: new Date().toISOString()
      };
      
      dispatch(addMessage(aiMessage));
      
      // Update form if AI returned interaction data
      if (data.interaction_data) {
        const d = data.interaction_data;
        const parseArrayField = (val: any) => {
          if (!val) return undefined;
          if (Array.isArray(val)) return val;
          if (typeof val === 'string') {
            try { 
              const parsed = JSON.parse(val); 
              return Array.isArray(parsed) ? parsed : [parsed];
            } catch (e) { return [val]; }
          }
          return [val];
        };
        const mappedData = {
          ...((d.hcp_name || d.hcpName) && { hcpName: d.hcp_name || d.hcpName }),
          ...((d.hospital || d.hospital) && { hospital: d.hospital || d.hospital }),
          ...((d.interaction_type || d.interactionType) && { interactionType: d.interaction_type || d.interactionType }),
          ...((d.interaction_date || d.interactionDate) && { interactionDate: d.interaction_date || d.interactionDate }),
          ...((d.interaction_time || d.interactionTime) && { interactionTime: d.interaction_time || d.interactionTime }),
          ...((d.attendees || d.attendees) && { 
            attendees: parseArrayField(d.attendees || d.attendees) 
          }),
          ...((d.topics_discussed || d.topicsDiscussed) && { topicsDiscussed: d.topics_discussed || d.topicsDiscussed }),
          ...((d.sentiment || d.sentiment) && { sentiment: d.sentiment || d.sentiment }),
          ...((d.outcomes || d.outcomes) && { outcomes: d.outcomes || d.outcomes }),
          ...((d.summary || d.summary) && { summary: d.summary || d.summary }),
          ...((d.action_items || d.actionItems) && { 
            actionItems: parseArrayField(d.action_items || d.actionItems) 
          }),
        };
        dispatch(updateInteraction(mappedData));
        // Simple logic to guess tool used (backend could return this explicitly)
        dispatch(setSelectedTool("log_interaction"));
      }
      
    } catch (error) {
      console.error("Chat Error", error);
      dispatch(addMessage({
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "Sorry, there was an error processing your request.",
        timestamp: new Date().toISOString()
      }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="w-[30%] min-w-[350px] bg-slate-50 flex flex-col border-l">
      {/* Header */}
      <div className="p-4 border-b bg-white flex items-center shadow-sm">
        <Bot className="text-blue-600 mr-2" />
        <h3 className="font-semibold text-slate-800">CRM Assistant</h3>
      </div>
      
      {/* Tool Usage Indicator */}
      {selectedTool && (
        <div className="bg-blue-100 text-blue-800 text-xs px-4 py-2 flex items-center">
          <Wrench size={12} className="mr-2" />
          Tool Used: ✓ {selectedTool.replace('_', ' ').toUpperCase()}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg p-3 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border text-slate-800 shadow-sm'}`}>
              <div className="flex items-center mb-1 space-x-2">
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                <span className="text-xs opacity-75 font-semibold">{msg.role === 'user' ? 'You' : 'AI'}</span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border text-slate-500 rounded-lg p-3 shadow-sm text-sm italic">
              AI is thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="e.g., Met Dr. Sharma today..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button 
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
