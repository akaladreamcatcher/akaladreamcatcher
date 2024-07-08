import { configureStore } from '@reduxjs/toolkit';
import lifestyleReducer from './lifestyleSlice';

export const store = configureStore({
  reducer: {
    lifestyle: lifestyleReducer,
  },
});
