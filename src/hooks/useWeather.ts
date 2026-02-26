import { useState, useEffect, useCallback } from 'react';
import type { WeatherData, ForecastData, TemperatureUnit } from '../types';
import { getCurrentWeather, getForecast } from '../services/weatherApi';

interface UseWeatherResult {
  weather: WeatherData | null;
  forecast: ForecastData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useWeather(
  lat: number | null,
  lon: number | null,
  units: TemperatureUnit = 'metric'
): UseWeatherResult {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (lat === null || lon === null) return;

    setIsLoading(true);
    setError(null);

    try {
      const [weatherData, forecastData] = await Promise.all([
        getCurrentWeather(lat, lon, units),
        getForecast(lat, lon, units),
      ]);
      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(message);
      setWeather(null);
      setForecast(null);
    } finally {
      setIsLoading(false);
    }
  }, [lat, lon, units]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { weather, forecast, isLoading, error, refetch: fetchData };
}
