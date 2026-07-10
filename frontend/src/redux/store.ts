import { configureStore } from '@reduxjs/toolkit';
import interactionReducer from './slices/interactionSlice';
import chatReducer from './slices/chatSlice';
import appReducer from './slices/appSlice';

export const store = configureStore({
  reducer: {
    interaction: interactionReducer,
    chat: chatReducer,
    app: appReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
