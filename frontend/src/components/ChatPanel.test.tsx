import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ChatPanel } from './ChatPanel';
import chatReducer from '../redux/slices/chatSlice';
import appReducer from '../redux/slices/appSlice';
import interactionReducer from '../redux/slices/interactionSlice';


// Mock axios
vi.mock('axios');

const renderWithRedux = (
  ui: React.ReactElement,
  {
    initialState = {
      chat: { messages: [] as any[] },
      app: { isLoading: false, selectedTool: null },
      interaction: {
        hcpName: '', hospital: '', interactionType: '', interactionDate: '', interactionTime: '',
        topicsDiscussed: '', sentiment: '', summary: '', outcomes: '', actionItems: [], attendees: []
      }
    },
    store = configureStore({
      reducer: { chat: chatReducer, app: appReducer, interaction: interactionReducer },
      preloadedState: initialState
    } as any)
  } = {}
) => {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store
  };
};

describe('ChatPanel', () => {
  it('renders correctly and accepts input', () => {
    renderWithRedux(<ChatPanel />);
    
    // Check if the input field is present
    const inputElement = screen.getByPlaceholderText(/e.g., Met Dr. Sharma today/i);
    expect(inputElement).toBeDefined();

    // Check if typing works
    fireEvent.change(inputElement, { target: { value: 'Test message' } });
    expect((inputElement as HTMLInputElement).value).toBe('Test message');
  });

  it('renders chat messages', () => {
    renderWithRedux(<ChatPanel />, {
      initialState: {
        chat: {
          messages: [
            { id: '1', role: 'user', content: 'User message', timestamp: '2024-03-01T00:00:00.000Z' },
            { id: '2', role: 'ai', content: 'AI message', timestamp: '2024-03-01T00:01:00.000Z' }
          ]
        },
        app: { isLoading: false, selectedTool: null },
        interaction: {} as any
      }
    });

    expect(screen.getByText('User message')).toBeDefined();
    expect(screen.getByText('AI message')).toBeDefined();
  });

  it('disables input and shows loading state while waiting for AI', () => {
    renderWithRedux(<ChatPanel />, {
      initialState: {
        chat: { messages: [] },
        app: { isLoading: true, selectedTool: null },
        interaction: {} as any
      }
    });

    const inputElement = screen.getByPlaceholderText(/e.g., Met Dr. Sharma today/i);
    const buttonElement = screen.getByRole('button');

    expect((inputElement as HTMLInputElement).disabled).toBe(true);
    expect((buttonElement as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByText('AI is thinking...')).toBeDefined();
  });
});
