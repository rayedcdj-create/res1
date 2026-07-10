import { describe, it, expect } from 'vitest';
import appReducer, { setLoading, setSelectedTool, AppState } from './appSlice';

describe('appSlice', () => {
  const initialState: AppState = {
    isLoading: false,
    selectedTool: null
  };

  it('should return initial state', () => {
    expect(appReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setLoading', () => {
    const nextState = appReducer(initialState, setLoading(true));
    expect(nextState.isLoading).toBe(true);
  });

  it('should handle setSelectedTool', () => {
    const nextState = appReducer(initialState, setSelectedTool('log_interaction'));
    expect(nextState.selectedTool).toBe('log_interaction');
  });
});
