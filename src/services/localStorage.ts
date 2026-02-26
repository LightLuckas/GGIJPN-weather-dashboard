import type { SavedCity, AppSettings } from '../types';

const STORAGE_KEYS = {
  SAVED_CITIES: 'weather-dashboard-cities',
  SETTINGS: 'weather-dashboard-settings',
} as const;

const DEFAULT_SETTINGS: AppSettings = {
  temperatureUnit: 'metric',
  darkMode: false,
};

export function getSavedCities(): SavedCity[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SAVED_CITIES);
    return data ? JSON.parse(data) : [];
  } catch {
    console.error('Failed to load saved cities from localStorage');
    return [];
  }
}

export function saveCities(cities: SavedCity[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_CITIES, JSON.stringify(cities));
  } catch {
    console.error('Failed to save cities to localStorage');
  }
}

export function getSettings(): AppSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch {
    console.error('Failed to load settings from localStorage');
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch {
    console.error('Failed to save settings to localStorage');
  }
}
