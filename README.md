# 🌤️ Weather Dashboard

A modern, responsive multi-city weather dashboard built with React 18 and TypeScript. Track real-time weather conditions, view 5-day forecasts with interactive charts, save favorite cities, and switch between light/dark themes.

![GitHub last commit](https://img.shields.io/github/last-commit/LightLuckas/GGIJPN-weather-dashboard)
![GitHub repo size](https://img.shields.io/github/repo-size/LightLuckas/GGIJPN-weather-dashboard)
![GitHub](https://img.shields.io/github/license/LightLuckas/GGIJPN-weather-dashboard)

## 🚀 Live Demo

[Deployed URL — Coming Soon](#)

## 📸 Screenshot

> Add screenshot after deployment

## ✨ Features

- **Multi-city weather tracking** — Search and add any city worldwide
- **Real-time data** from OpenWeatherMap API
- **5-day forecast** with interactive temperature, humidity, and rain probability charts
- **Favorite cities** — Star cities for quick access on the Favorites page
- **Dark / Light theme** toggle with system persistence
- **°C / °F unit switching** — Toggle between metric and imperial
- **LocalStorage sync** — Your cities and preferences persist across sessions
- **Responsive design** — Mobile-first, works on all screen sizes
- **Form validation** — Input validation with accessible error messages
- **Loading skeletons** — Smooth loading states for all weather cards
- **Error handling** — Graceful error states with retry guidance
- **Empty states** — Helpful onboarding when no cities are added
- **Accessible** — ARIA labels, roles, and keyboard navigation

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 + TypeScript | UI framework with type safety |
| Tailwind CSS v4 | Utility-first responsive styling |
| React Router v7 | Client-side routing |
| Recharts | Interactive charts (Area, Line, Bar) |
| OpenWeatherMap API | Real-time weather data |
| Context API + useReducer | Global state management |
| LocalStorage | Data persistence |
| Vite | Build tool and dev server |
| Vitest + RTL | Unit testing |

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CitySearch.tsx   # Search with validation + autocomplete
│   ├── ForecastChart.tsx # 5-day forecast with Recharts
│   ├── Header.tsx       # Navigation + controls
│   ├── Layout.tsx       # App shell with Outlet
│   ├── ThemeToggle.tsx  # Dark/light mode switch
│   └── WeatherCard.tsx  # City weather card with details
├── context/
│   └── AppContext.tsx    # Global state (cities, settings)
├── hooks/
│   ├── useCitySearch.ts # Debounced city search hook
│   └── useWeather.ts    # Weather + forecast data hook
├── pages/
│   ├── Dashboard.tsx    # Main page with search + cards
│   ├── Favorites.tsx    # Starred cities page
│   ├── Forecast.tsx     # 5-day forecast detail page
│   └── NotFound.tsx     # 404 page
├── services/
│   ├── localStorage.ts  # Persistence helpers
│   └── weatherApi.ts    # OpenWeatherMap API client
├── test/
│   ├── setup.ts         # Test configuration
│   ├── CitySearch.test.tsx
│   ├── ThemeToggle.test.tsx
│   └── useWeather.test.ts
└── types/
    └── index.ts         # TypeScript interfaces
```

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/LightLuckas/GGIJPN-weather-dashboard.git
cd GGIJPN-weather-dashboard

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Add your OpenWeatherMap API key to .env

# Start development server
npm run dev

# Run tests
npm run test:run

# Production build
npm run build
```

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `VITE_OPENWEATHER_API_KEY` | Your OpenWeatherMap API key ([get one free](https://openweathermap.org/api)) |

> ⚠️ Never commit `.env` files. Use `.env.example` as a template.

## 🧪 Tests

```bash
npm run test:run    # Run once
npm run test        # Watch mode
```

**16 tests** across 3 test suites:
- `ThemeToggle` — Rendering, toggle behavior, localStorage persistence
- `CitySearch` — Input validation, error messages, accessibility
- `useWeather` — Data fetching, error handling, parameter passing

## 📊 Project Stats

- **3 feature branches** merged via PR workflow
- **16 passing unit tests**
- Built with **zero TypeScript errors**

## 📄 License

MIT
