import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from 'recharts';
import { useWeather } from '../hooks/useWeather';
import { useAppContext } from '../context/AppContext';
import { getWeatherIconUrl, formatDate } from '../services/weatherApi';
import type { ForecastItem } from '../types';

export default function ForecastChart() {
  const { lat, lon } = useParams<{ lat: string; lon: string }>();
  const [searchParams] = useSearchParams();
  const cityName = searchParams.get('name') || 'Unknown';
  const country = searchParams.get('country') || '';
  const { state } = useAppContext();
  const { temperatureUnit } = state.settings;

  const { forecast, isLoading, error } = useWeather(
    lat ? parseFloat(lat) : null,
    lon ? parseFloat(lon) : null,
    temperatureUnit
  );

  if (isLoading) {
    return <ForecastSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg mb-2">Failed to load forecast</p>
        <p className="text-(--color-text-secondary)">{error}</p>
        <Link to="/" className="inline-block mt-4 text-blue-500 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!forecast) return null;

  // Process data for charts
  const chartData = forecast.list.map((item: ForecastItem) => ({
    time: new Date(item.dt * 1000).toLocaleString('en-US', {
      weekday: 'short',
      hour: '2-digit',
      hour12: true,
    }),
    temp: Math.round(item.main.temp),
    feelsLike: Math.round(item.main.feels_like),
    humidity: item.main.humidity,
    windSpeed: item.wind.speed,
    rain: item.pop * 100,
    icon: item.weather[0].icon,
    description: item.weather[0].description,
  }));

  // Group by day for daily summary
  const dailyData = new Map<string, ForecastItem[]>();
  forecast.list.forEach((item: ForecastItem) => {
    const date = formatDate(item.dt);
    if (!dailyData.has(date)) {
      dailyData.set(date, []);
    }
    dailyData.get(date)!.push(item);
  });

  const dailySummary = Array.from(dailyData.entries()).map(([date, items]) => ({
    date,
    tempMax: Math.round(Math.max(...items.map((i) => i.main.temp_max))),
    tempMin: Math.round(Math.min(...items.map((i) => i.main.temp_min))),
    avgHumidity: Math.round(items.reduce((acc, i) => acc + i.main.humidity, 0) / items.length),
    maxRain: Math.round(Math.max(...items.map((i) => i.pop)) * 100),
    icon: items[Math.floor(items.length / 2)].weather[0].icon,
    description: items[Math.floor(items.length / 2)].weather[0].description,
  }));

  const unit = temperatureUnit === 'metric' ? '°C' : '°F';
  const isDark = state.settings.darkMode;
  const axisColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#334155' : '#e2e8f0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link to="/" className="text-blue-500 hover:underline text-sm mb-2 inline-block no-underline">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-(--color-text)">
            {cityName}, {country}
          </h1>
          <p className="text-(--color-text-secondary)">5-Day Weather Forecast</p>
        </div>
      </div>

      {/* Daily Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {dailySummary.map((day) => (
          <div
            key={day.date}
            className="bg-(--color-surface) rounded-xl p-4 border border-(--color-border) text-center"
          >
            <p className="text-sm font-medium text-(--color-text-secondary) mb-2">{day.date}</p>
            <img
              src={getWeatherIconUrl(day.icon)}
              alt={day.description}
              className="w-12 h-12 mx-auto"
            />
            <p className="text-sm capitalize text-(--color-text-secondary) mb-2">{day.description}</p>
            <div className="flex justify-center gap-2 text-sm">
              <span className="font-bold text-(--color-text)">{day.tempMax}{unit}</span>
              <span className="text-(--color-text-secondary)">{day.tempMin}{unit}</span>
            </div>
            <p className="text-xs text-(--color-text-secondary) mt-1">💧 {day.maxRain}%</p>
          </div>
        ))}
      </div>

      {/* Temperature Chart */}
      <div className="bg-(--color-surface) rounded-2xl p-4 sm:p-6 border border-(--color-border)">
        <h2 className="text-lg font-semibold mb-4 text-(--color-text)">Temperature Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: axisColor }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 12, fill: axisColor }}
              domain={['auto', 'auto']}
              unit={unit}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                border: `1px solid ${gridColor}`,
                borderRadius: '12px',
                color: isDark ? '#f1f5f9' : '#0f172a',
              }}
              formatter={(value) => [`${value}${unit}`]}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="#3b82f6"
              fill="url(#tempGradient)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="feelsLike"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Humidity & Rain Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-(--color-surface) rounded-2xl p-4 sm:p-6 border border-(--color-border)">
          <h2 className="text-lg font-semibold mb-4 text-(--color-text)">Humidity</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: axisColor }}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 12, fill: axisColor }} domain={[0, 100]} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  border: `1px solid ${gridColor}`,
                  borderRadius: '12px',
                  color: isDark ? '#f1f5f9' : '#0f172a',
                }}
                formatter={(value) => [`${value}%`, 'Humidity']}
              />
              <Line type="monotone" dataKey="humidity" stroke="#06b6d4" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-(--color-surface) rounded-2xl p-4 sm:p-6 border border-(--color-border)">
          <h2 className="text-lg font-semibold mb-4 text-(--color-text)">Rain Probability</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: axisColor }}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 12, fill: axisColor }} domain={[0, 100]} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  border: `1px solid ${gridColor}`,
                  borderRadius: '12px',
                  color: isDark ? '#f1f5f9' : '#0f172a',
                }}
                formatter={(value) => [`${value}%`, 'Rain Chance']}
              />
              <Bar dataKey="rain" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function ForecastSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-4 w-32 bg-(--color-border) rounded mb-2" />
        <div className="h-8 w-48 bg-(--color-border) rounded mb-1" />
        <div className="h-4 w-40 bg-(--color-border) rounded" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-40 bg-(--color-border) rounded-xl" />
        ))}
      </div>
      <div className="h-80 bg-(--color-border) rounded-2xl" />
    </div>
  );
}
