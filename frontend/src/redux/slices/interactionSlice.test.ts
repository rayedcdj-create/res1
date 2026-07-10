import { describe, it, expect } from 'vitest';
import interactionReducer, { updateInteraction, resetInteraction, InteractionState } from './interactionSlice';

describe('interactionSlice', () => {
  const initialState: InteractionState = {
    hcpName: '',
    hospital: '',
    interactionType: '',
    interactionDate: '',
    interactionTime: '',
    topicsDiscussed: '',
    sentiment: '',
    summary: '',
    outcomes: '',
    actionItems: [],
    attendees: [],
  };

  it('should return initial state', () => {
    expect(interactionReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle updateInteraction', () => {
    const nextState = interactionReducer(initialState, updateInteraction({ hcpName: 'Dr. House' }));
    expect(nextState.hcpName).toEqual('Dr. House');
    expect(nextState.hospital).toEqual(''); // remains unchanged
  });

  it('should handle resetInteraction', () => {
    const modifiedState = { ...initialState, hcpName: 'Dr. House' };
    const nextState = interactionReducer(modifiedState, resetInteraction());
    expect(nextState).toEqual(initialState);
  });
});
