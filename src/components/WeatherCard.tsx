import { useWeather } from '../hooks/useWeather';
import { useAppContext } from '../context/AppContext';
import type { SavedCity } from '../types';
import { getWeatherIconUrl, formatTemperature, formatWindSpeed } from '../services/weatherApi';
import { Link } from 'react-router-dom';

interface WeatherCardProps {
  city: SavedCity;
}

export default function WeatherCard({ city }: WeatherCardProps) {
  const { state, removeCity, toggleFavorite } = useAppContext();
  const { temperatureUnit } = state.settings;
  const { weather, isLoading, error } = useWeather(city.lat, city.lon, temperatureUnit);

  if (isLoading) {
    return <WeatherCardSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-(--color-surface) rounded-2xl p-5 border border-red-300 dark:border-red-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">{city.name}</h3>
          <button
            onClick={() => removeCity(city.id)}
            className="text-(--color-text-secondary) hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer text-lg"
            aria-label={`Remove ${city.name}`}
          >
            ✕
          </button>
        </div>
        <p className="text-red-500 text-sm">{error}</p>
        <p className="text-(--color-text-secondary) text-xs mt-1">Check API key or try again</p>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="bg-(--color-surface) rounded-2xl p-5 border border-(--color-border) hover:shadow-lg transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg text-(--color-text)">
            {weather.name}
          </h3>
          <p className="text-sm text-(--color-text-secondary)">{weather.sys.country}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleFavorite(city.id)}
            className="text-lg bg-transparent border-none cursor-pointer transition-transform hover:scale-125 p-1"
            aria-label={city.isFavorite ? `Remove ${city.name} from favorites` : `Add ${city.name} to favorites`}
          >
            {city.isFavorite ? '⭐' : '☆'}
          </button>
          <button
            onClick={() => removeCity(city.id)}
            className="text-(--color-text-secondary) hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer text-sm opacity-0 group-hover:opacity-100 p-1"
            aria-label={`Remove ${city.name}`}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Weather Icon + Temp */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <img
            src={getWeatherIconUrl(weather.weather[0].icon, '2x')}
            alt={weather.weather[0].description}
            className="w-16 h-16"
          />
          <div>
            <p className="text-3xl font-bold text-(--color-text)">
              {formatTemperature(weather.main.temp, temperatureUnit)}
            </p>
            <p className="text-sm text-(--color-text-secondary) capitalize">
              {weather.weather[0].description}
            </p>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <DetailItem label="Feels Like" value={formatTemperature(weather.main.feels_like, temperatureUnit)} />
        <DetailItem label="Humidity" value={`${weather.main.humidity}%`} />
        <DetailItem label="Wind" value={formatWindSpeed(weather.wind.speed, temperatureUnit)} />
        <DetailItem label="Pressure" value={`${weather.main.pressure} hPa`} />
      </div>

      {/* View Forecast Link */}
      <Link
        to={`/forecast/${city.lat}/${city.lon}?name=${encodeURIComponent(city.name)}&country=${city.country}`}
        className="block text-center py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium no-underline transition-colors"
      >
        View 5-Day Forecast →
      </Link>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-(--color-bg) rounded-lg p-2.5 text-center">
      <p className="text-xs text-(--color-text-secondary) mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-(--color-text)">{value}</p>
    </div>
  );
}

function WeatherCardSkeleton() {
  return (
    <div className="bg-(--color-surface) rounded-2xl p-5 border border-(--color-border) animate-pulse">
      <div className="flex justify-between mb-3">
        <div>
          <div className="h-5 w-24 bg-(--color-border) rounded mb-2" />
          <div className="h-4 w-10 bg-(--color-border) rounded" />
        </div>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-16 h-16 bg-(--color-border) rounded-full" />
        <div>
          <div className="h-8 w-20 bg-(--color-border) rounded mb-1" />
          <div className="h-4 w-16 bg-(--color-border) rounded" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-14 bg-(--color-border) rounded-lg" />
        ))}
      </div>
      <div className="h-9 bg-(--color-border) rounded-lg" />
    </div>
  );
}
