// Weather API response types

export interface WeatherData {
  id: number;
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  visibility: number;
  dt: number;
  timezone: number;
  coord: {
    lon: number;
    lat: number;
  };
}

export interface ForecastData {
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    country: string;
    coord: {
      lon: number;
      lat: number;
    };
    timezone: number;
  };
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  visibility: number;
  pop: number;
  dt_txt: string;
}

export interface GeocodingResult {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

// App types

export interface SavedCity {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  isFavorite: boolean;
  addedAt: number;
}

export type TemperatureUnit = 'metric' | 'imperial';

export interface AppSettings {
  temperatureUnit: TemperatureUnit;
  darkMode: boolean;
}
