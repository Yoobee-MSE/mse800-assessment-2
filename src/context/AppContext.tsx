import { createContext, useContext, useReducer, useEffect, ReactNode, useState } from 'react';
import { getDictionary } from '../dictionary/dictionaries';

export type AppState = {
  isAuthenticated: boolean,
  user: any,
  isPageLoading: boolean,
  language: string,
  dictionary: any
}
// Initial state
const initialState: AppState = {
  isAuthenticated: false,
  user: null,
  isPageLoading: true,
  language: 'en',
  dictionary: {}
};

// Actions
export const APP_ACTION = {
  SET_IS_AUTHENTICATED: 'SET_IS_AUTHENTICATED',
  SET_USER: 'SET_USER',
  SET_PAGE_LOADING: 'SET_PAGE_LOADING',
  SET_APP_LANGUAGE: 'SET_APP_LANGUAGE',
  SET_APP_DICTIONARY: 'SET_APP_DICTIONARY'
};

// Reducer function
const reducer = (state: typeof initialState, action: { type: string; payload: any }) => {
  switch (action.type) {
    case APP_ACTION.SET_IS_AUTHENTICATED:
      return { ...state, isAuthenticated: action.payload };
    case APP_ACTION.SET_USER:
      return { ...state, user: action.payload };
    case APP_ACTION.SET_PAGE_LOADING:
      return { ...state, isPageLoading: action.payload };
    case APP_ACTION.SET_APP_DICTIONARY:
      return { ...state, dictionary: action.payload };
    case APP_ACTION.SET_APP_LANGUAGE:
      return { ...state, language: action.payload };
    default:
      return state;
  }
};

// Create context
const AppContext = createContext<{
  state: typeof initialState;
  dispatch: React.Dispatch<{ type: string; payload: any }>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Load state from localStorage
const loadState = (): typeof initialState => {
  if (typeof window !== 'undefined') {
    const savedState = localStorage.getItem('appState');
    return savedState ? JSON.parse(savedState) : initialState;
  }
  return initialState;
};

// Save state to localStorage
const saveState = (state: typeof initialState) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('appState', JSON.stringify(state));
  }
};

// Provider component
const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isHydrated, setIsHydrated] = useState(false); // Add a state to track hydration

  useEffect(() => {
    const loadedState = loadState();
    dispatch({ type: APP_ACTION.SET_IS_AUTHENTICATED, payload: loadedState.isAuthenticated });
    dispatch({ type: APP_ACTION.SET_USER, payload: loadedState.user });
    dispatch({ type: APP_ACTION.SET_APP_LANGUAGE, payload: loadedState.language });
    setIsHydrated(true); // Set hydrated to true after loading state
  }, []);

  useEffect(() => {
    if (isHydrated) {
      saveState(state);
    }
  }, [state, isHydrated]);

  // Load dictionary based on the language
  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(state.language);
      dispatch({ type: APP_ACTION.SET_APP_DICTIONARY, payload: dictionary });
    };

    loadDictionary();
  }, [state.language]);

  if (!isHydrated) {
    return null; // Render nothing until the state is hydrated
  }

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = () => useContext(AppContext);

export { AppProvider, AppContext };
