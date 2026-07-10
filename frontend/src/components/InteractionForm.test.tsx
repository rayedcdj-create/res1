import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { InteractionForm } from './InteractionForm';
import interactionReducer from '../redux/slices/interactionSlice';

// Helper function to render with a mock Redux store
const renderWithRedux = (
  ui: React.ReactElement,
  {
    initialState = {
      interaction: {
        hcpName: 'Dr. John Doe',
        hospital: 'General Hospital',
        interactionType: 'Meeting',
        interactionDate: '2024-03-01',
        interactionTime: '10:00 AM',
        topicsDiscussed: 'Product XYZ',
        sentiment: 'Positive',
        summary: 'Good discussion',
        outcomes: 'Follow up next week',
        actionItems: ['Send literature'],
        attendees: ['Dr. John Doe', 'Jane Smith']
      }
    },
    store = configureStore({
      reducer: { interaction: interactionReducer },
      preloadedState: initialState
    })
  } = {}
) => {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store
  };
};

describe('InteractionForm', () => {
  it('renders all fields with populated data from Redux', () => {
    renderWithRedux(<InteractionForm />);
    
    // Check if input fields display the populated data
    expect(screen.getByDisplayValue('Dr. John Doe')).toBeDefined();
    expect(screen.getByDisplayValue('General Hospital')).toBeDefined();
    expect(screen.getByDisplayValue('Meeting')).toBeDefined();
    expect(screen.getByDisplayValue('2024-03-01')).toBeDefined();
    
    // Check text areas
    expect(screen.getByDisplayValue('Good discussion')).toBeDefined();
    expect(screen.getByDisplayValue('Product XYZ')).toBeDefined();
    expect(screen.getByDisplayValue('Positive')).toBeDefined();
    
    // Check lists
    expect(screen.getByText('Send literature')).toBeDefined();
  });

  it('renders fallback text for empty lists', () => {
    renderWithRedux(<InteractionForm />, {
      initialState: {
        interaction: {
          hcpName: '', hospital: '', interactionType: '', interactionDate: '', interactionTime: '',
          topicsDiscussed: '', sentiment: '', summary: '', outcomes: '',
          actionItems: [], attendees: [] // Empty lists
        }
      }
    });

    expect(screen.getByText('No action items')).toBeDefined();
  });
});
