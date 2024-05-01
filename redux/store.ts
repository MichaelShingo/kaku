import { configureStore } from '@reduxjs/toolkit';
import windowReducer from './features/windowSlice';
import toolReducer from './features/toolSlice';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

export const store = configureStore({
	reducer: { windowReducer, toolReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
