import { describe, it, expect } from 'vitest';
import chatReducer, { addMessage, clearChat, ChatState, ChatMessage } from './chatSlice';

describe('chatSlice', () => {
  const initialState: ChatState = {
    messages: []
  };

  it('should return initial state', () => {
    expect(chatReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addMessage', () => {
    const newMessage: ChatMessage = {
      id: '1',
      role: 'user',
      content: 'Hello',
      timestamp: '2024-01-01T00:00:00.000Z'
    };
    const nextState = chatReducer(initialState, addMessage(newMessage));
    expect(nextState.messages).toHaveLength(1);
    expect(nextState.messages[0]).toEqual(newMessage);
  });

  it('should handle clearChat', () => {
    const modifiedState: ChatState = {
      messages: [{
        id: '1',
        role: 'user',
        content: 'Hello',
        timestamp: '2024-01-01T00:00:00.000Z'
      }]
    };
    const nextState = chatReducer(modifiedState, clearChat());
    expect(nextState.messages).toHaveLength(0);
  });
});
