import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useWeather } from '../hooks/useWeather';

// Mock the weather API module
vi.mock('../services/weatherApi', () => ({
  getCurrentWeather: vi.fn(),
  getForecast: vi.fn(),
}));

import { getCurrentWeather, getForecast } from '../services/weatherApi';

const mockWeatherData = {
  id: 1,
  name: 'London',
  sys: { country: 'GB', sunrise: 1000, sunset: 2000 },
  main: { temp: 15, feels_like: 13, temp_min: 12, temp_max: 18, humidity: 72, pressure: 1013 },
  weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
  wind: { speed: 3.5, deg: 180 },
  clouds: { all: 0 },
  visibility: 10000,
  dt: 1700000000,
  timezone: 0,
  coord: { lon: -0.1257, lat: 51.5085 },
};

const mockForecastData = {
  list: [],
  city: { id: 1, name: 'London', country: 'GB', coord: { lon: -0.1257, lat: 51.5085 }, timezone: 0 },
};

describe('useWeather', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns initial state when lat/lon are null', () => {
    const { result } = renderHook(() => useWeather(null, null));

    expect(result.current.weather).toBeNull();
    expect(result.current.forecast).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('fetches weather data successfully', async () => {
    vi.mocked(getCurrentWeather).mockResolvedValue(mockWeatherData);
    vi.mocked(getForecast).mockResolvedValue(mockForecastData);

    const { result } = renderHook(() => useWeather(51.5085, -0.1257));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.weather).toEqual(mockWeatherData);
    expect(result.current.forecast).toEqual(mockForecastData);
    expect(result.current.error).toBeNull();
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(getCurrentWeather).mockRejectedValue(new Error('API key invalid'));
    vi.mocked(getForecast).mockRejectedValue(new Error('API key invalid'));

    const { result } = renderHook(() => useWeather(51.5085, -0.1257));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('API key invalid');
    expect(result.current.weather).toBeNull();
    expect(result.current.forecast).toBeNull();
  });

  it('calls API with correct parameters', async () => {
    vi.mocked(getCurrentWeather).mockResolvedValue(mockWeatherData);
    vi.mocked(getForecast).mockResolvedValue(mockForecastData);

    renderHook(() => useWeather(51.5085, -0.1257, 'imperial'));

    await waitFor(() => {
      expect(getCurrentWeather).toHaveBeenCalledWith(51.5085, -0.1257, 'imperial');
      expect(getForecast).toHaveBeenCalledWith(51.5085, -0.1257, 'imperial');
    });
  });
});
