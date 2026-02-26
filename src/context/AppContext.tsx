import { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from 'react';
import type { SavedCity, AppSettings, TemperatureUnit } from '../types';
import { getSavedCities, saveCities, getSettings, saveSettings } from '../services/localStorage';

// State
interface AppState {
  cities: SavedCity[];
  settings: AppSettings;
}

// Actions
type AppAction =
  | { type: 'ADD_CITY'; payload: SavedCity }
  | { type: 'REMOVE_CITY'; payload: string }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'SET_DARK_MODE'; payload: boolean }
  | { type: 'SET_TEMPERATURE_UNIT'; payload: TemperatureUnit }
  | { type: 'LOAD_STATE'; payload: AppState };

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_CITY': {
      const exists = state.cities.some(
        (c) => c.lat === action.payload.lat && c.lon === action.payload.lon
      );
      if (exists) return state;
      return { ...state, cities: [...state.cities, action.payload] };
    }
    case 'REMOVE_CITY':
      return {
        ...state,
        cities: state.cities.filter((c) => c.id !== action.payload),
      };
    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        cities: state.cities.map((c) =>
          c.id === action.payload ? { ...c, isFavorite: !c.isFavorite } : c
        ),
      };
    case 'SET_DARK_MODE':
      return {
        ...state,
        settings: { ...state.settings, darkMode: action.payload },
      };
    case 'SET_TEMPERATURE_UNIT':
      return {
        ...state,
        settings: { ...state.settings, temperatureUnit: action.payload },
      };
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  addCity: (city: Omit<SavedCity, 'id' | 'addedAt' | 'isFavorite'>) => void;
  removeCity: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setDarkMode: (enabled: boolean) => void;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
}

const AppContext = createContext<AppContextType | null>(null);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const initialState: AppState = {
    cities: getSavedCities(),
    settings: getSettings(),
  };

  const [state, dispatch] = useReducer(appReducer, initialState);

  // Sync to localStorage
  useEffect(() => {
    saveCities(state.cities);
  }, [state.cities]);

  useEffect(() => {
    saveSettings(state.settings);
  }, [state.settings]);

  // Apply dark mode to DOM
  useEffect(() => {
    if (state.settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.settings.darkMode]);

  const addCity = useCallback(
    (city: Omit<SavedCity, 'id' | 'addedAt' | 'isFavorite'>) => {
      const newCity: SavedCity = {
        ...city,
        id: `${city.lat}-${city.lon}-${Date.now()}`,
        addedAt: Date.now(),
        isFavorite: false,
      };
      dispatch({ type: 'ADD_CITY', payload: newCity });
    },
    []
  );

  const removeCity = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_CITY', payload: id });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: id });
  }, []);

  const setDarkMode = useCallback((enabled: boolean) => {
    dispatch({ type: 'SET_DARK_MODE', payload: enabled });
  }, []);

  const setTemperatureUnit = useCallback((unit: TemperatureUnit) => {
    dispatch({ type: 'SET_TEMPERATURE_UNIT', payload: unit });
  }, []);

  return (
    <AppContext.Provider
      value={{ state, addCity, removeCity, toggleFavorite, setDarkMode, setTemperatureUnit }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
