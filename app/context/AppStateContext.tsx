'use client';
import React, { createContext, useReducer, useContext, Dispatch } from 'react';

type VoidFunction = () => void;

interface GlobalState {
	scrollToContact: VoidFunction;
	scrollToBio: VoidFunction;
	scrollToPortfolio: VoidFunction;
}

const nullFunction = (): void => {
	return;
};

const initialState: GlobalState = {
	scrollToContact: nullFunction,
	scrollToBio: nullFunction,
	scrollToPortfolio: nullFunction,
};

export type AppAction = { type: string; payload?: string | number | VoidFunction };

interface AppStateContextType {
	state: GlobalState;
	dispatchContext: Dispatch<AppAction>;
}

export const actions: Record<string, string> = {
	SET_SCROLL_TO_CONTACT: 'SCROLL_TO_CONTACT',
	SET_SCROLL_TO_BIO: 'SCROLL_TO_BIO',
	SET_SCROLL_TO_PORTFOLIO: 'SCROLL_TO_PORTFOLIO',
};

const appReducer = (state: GlobalState, action: AppAction): GlobalState => {
	switch (action.type) {
		case actions.SET_SCROLL_TO_CONTACT:
			return { ...state, scrollToContact: action.payload as VoidFunction };
		case actions.SET_SCROLL_TO_BIO:
			return { ...state, scrollToBio: action.payload as VoidFunction };
		case actions.SET_SCROLL_TO_PORTFOLIO:
			return { ...state, scrollToPortfolio: action.payload as VoidFunction };
		default:
			return state;
	}
};

export const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

interface Props {
	children: React.ReactNode;
}

const AppStateProvider: React.FC<Props> = ({ children }) => {
	const [state, dispatchContext] = useReducer(appReducer, initialState);

	return (
		<AppStateContext.Provider value={{ state, dispatchContext: dispatchContext }}>
			{children}
		</AppStateContext.Provider>
	);
};

export const useAppState = (): AppStateContextType => {
	const context = useContext(AppStateContext);
	if (!context) {
		throw new Error('useAppState must be used within an AppStateProvider');
	}
	return context;
};

export default AppStateProvider;
