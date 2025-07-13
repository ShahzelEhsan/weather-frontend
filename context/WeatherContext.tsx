import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';

// Define state shape
interface WeatherState {
  location: any | null;  // You can replace 'any' with a more specific type
  weather: any | null;
}

// Define actions
type Action =
  | { type: 'SET_LOCATION'; payload: any }  // Replace 'any' with your location type
  | { type: 'SET_WEATHER'; payload: any }; // Replace 'any' with your weather type

const initialState: WeatherState = {
  location: null,
  weather: null,
};

function reducer(state: WeatherState, action: Action): WeatherState {
  switch (action.type) {
    case 'SET_LOCATION':
      return { ...state, location: action.payload };
    case 'SET_WEATHER':
      return { ...state, weather: action.payload };
    default:
      return state;
  }
}

// Context value type
interface WeatherContextProps {
  state: WeatherState;
  dispatch: Dispatch<Action>;
}

// Create context with typed default value (or null and handle null check)
const WeatherContext = createContext<WeatherContextProps | undefined>(undefined);

interface WeatherProviderProps {
  children: ReactNode;
}

export const WeatherProvider = ({ children }: WeatherProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <WeatherContext.Provider value={{ state, dispatch }}>
      {children}
    </WeatherContext.Provider>
  );
};

// Custom hook to use context with null check
export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

