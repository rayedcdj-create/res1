import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface AppState {
  isLoading: boolean;
  selectedTool: string | null;
}

const initialState: AppState = {
  isLoading: false,
  selectedTool: null,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSelectedTool: (state, action: PayloadAction<string | null>) => {
      state.selectedTool = action.payload;
    },
  },
});

export const { setLoading, setSelectedTool } = appSlice.actions;
export default appSlice.reducer;
