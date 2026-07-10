import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ChatPanel } from './ChatPanel';
import chatReducer from '../redux/slices/chatSlice';
import appReducer from '../redux/slices/appSlice';
import interactionReducer from '../redux/slices/interactionSlice';
import { server } from '../test/server';

const renderWithRedux = (ui: React.ReactElement) => {
  const store = configureStore({
    reducer: { chat: chatReducer, app: appReducer, interaction: interactionReducer },
    preloadedState: {
      chat: { messages: [] },
      app: { isLoading: false, selectedTool: null },
      interaction: {
        hcpName: '', hospital: '', interactionType: '', interactionDate: '', interactionTime: '',
        topicsDiscussed: '', sentiment: '', summary: '', outcomes: '', actionItems: [], attendees: []
      }
    } as any
  });
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store
  };
};

describe('ChatPanel API Communication Integrity', () => {

  it('successfully maps backend snake_case response to Redux camelCase', async () => {
    const { store } = renderWithRedux(<ChatPanel />);
    
    // Simulate user input
    const inputElement = screen.getByPlaceholderText(/e.g., Met Dr. Sharma today/i);
    fireEvent.change(inputElement, { target: { value: 'trigger success' } });
    
    // Click send
    const buttonElement = screen.getByRole('button');
    fireEvent.click(buttonElement);

    // Wait for the UI to display the MSW mock response message
    await waitFor(() => {
      expect(screen.getByText('Interaction logged successfully.')).toBeDefined();
    });

    // Assert that the Redux state was correctly populated from the backend response
    const state = store.getState().interaction;
    
    // Verify snake_case to camelCase mapping worked perfectly
    expect(state.hcpName).toBe('Dr. Jane Doe');
    expect(state.hospital).toBe('Mock Hospital');
    expect(state.interactionType).toBe('Email');
    expect(state.interactionDate).toBe('2024-05-01');
    expect(state.topicsDiscussed).toBe('New Trial');
    expect(state.sentiment).toBe('Positive');
    expect(state.summary).toBe('Sent trial information');
    expect(state.outcomes).toBe('Pending review');
    expect(state.actionItems).toEqual(['Follow up in a week']);
    expect(state.attendees).toEqual(['Dr. Jane Doe']);
  });

  it('gracefully handles 500 internal server errors from the backend', async () => {
    renderWithRedux(<ChatPanel />);
    
    // Simulate user input that triggers the 500 error MSW handler
    const inputElement = screen.getByPlaceholderText(/e.g., Met Dr. Sharma today/i);
    fireEvent.change(inputElement, { target: { value: 'trigger 500 error' } });
    
    // Click send
    const buttonElement = screen.getByRole('button');
    fireEvent.click(buttonElement);

    // Wait for the UI to display the fallback error message
    await waitFor(() => {
      expect(screen.getByText('Sorry, there was an error processing your request.')).toBeDefined();
    });
    
    // Ensure loading state was reset (input is enabled again)
    expect(inputElement.hasAttribute('disabled')).toBe(false);
  });
});
