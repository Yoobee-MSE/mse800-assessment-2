import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Initial state
const initialState = {
  isAuthenticated: false,
};

// Actions
export const APP_ACTION = {
  SET_IS_AUTHENTICATED: 'SET_IS_AUTHENTICATED',
};

// Reducer function
const reducer = (state: typeof initialState, action: { type: string; payload: any }) => {
  switch (action.type) {
    case APP_ACTION.SET_IS_AUTHENTICATED:
      return { ...state, search: action.payload };
    default:
      return state;
  }
};

// Create context
const AppContext = createContext<{
  state: typeof initialState;
  appDispatch: React.Dispatch<{ type: string; payload: any }>;
}>({
  state: initialState,
  appDispatch: () => null,
});

// Provider component
const AppProvider = ({ children }) => {
  const [state, appDispatch] = useReducer(reducer, initialState);
  return (
    AppContext.Provider
  )
};

// Custom hook to use the AppContext
export const useAppContext = () => useContext(AppContext);

export { AppProvider, AppContext };
