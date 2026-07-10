import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface InteractionState {
  hcpName: string;
  interactionType: string;
  interactionDate: string;
  interactionTime: string;
  hospital: string;
  attendees: string[];
  topicsDiscussed: string;
  sentiment: string;
  outcomes: string;
  summary: string;
  actionItems: string[];
}

const initialState: InteractionState = {
  hcpName: '',
  interactionType: '',
  interactionDate: '',
  interactionTime: '',
  hospital: '',
  attendees: [],
  topicsDiscussed: '',
  sentiment: '',
  outcomes: '',
  summary: '',
  actionItems: [],
};

export const interactionSlice = createSlice({
  name: 'interaction',
  initialState,
  reducers: {
    updateInteraction: (state, action: PayloadAction<Partial<InteractionState>>) => {
      return { ...state, ...action.payload };
    },
    resetInteraction: () => initialState,
  },
});

export const { updateInteraction, resetInteraction } = interactionSlice.actions;
export default interactionSlice.reducer;
