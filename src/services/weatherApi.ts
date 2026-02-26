const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org';

import type { WeatherData, ForecastData, GeocodingResult, TemperatureUnit } from '../types';

export class WeatherApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'WeatherApiError';
  }
}

async function fetchWithError<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 401) {
      throw new WeatherApiError('Invalid API key. Please check your configuration.', 401);
    }
    if (response.status === 404) {
      throw new WeatherApiError('Location not found. Please try a different search.', 404);
    }
    if (response.status === 429) {
      throw new WeatherApiError('Too many requests. Please try again later.', 429);
    }
    throw new WeatherApiError(`API error: ${response.statusText}`, response.status);
  }

  return response.json();
}

export async function getCurrentWeather(
  lat: number,
  lon: number,
  units: TemperatureUnit = 'metric'
): Promise<WeatherData> {
  const url = `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
  return fetchWithError<WeatherData>(url);
}

export async function getForecast(
  lat: number,
  lon: number,
  units: TemperatureUnit = 'metric'
): Promise<ForecastData> {
  const url = `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
  return fetchWithError<ForecastData>(url);
}

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  if (!query.trim()) return [];
  const url = `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
  return fetchWithError<GeocodingResult[]>(url);
}

export function getWeatherIconUrl(iconCode: string, size: '2x' | '4x' = '2x'): string {
  return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
}

export function formatTemperature(temp: number, unit: TemperatureUnit): string {
  return `${Math.round(temp)}°${unit === 'metric' ? 'C' : 'F'}`;
}

export function formatWindSpeed(speed: number, unit: TemperatureUnit): string {
  return unit === 'metric' ? `${speed.toFixed(1)} m/s` : `${speed.toFixed(1)} mph`;
}

export function formatTime(timestamp: number, timezone: number): string {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  });
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}
