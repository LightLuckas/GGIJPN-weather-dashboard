import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const location = useLocation();
  const { state, setTemperatureUnit } = useAppContext();
  const { temperatureUnit } = state.settings;

  const navLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/favorites', label: 'Favorites' },
  ];

  return (
    <header className="bg-(--color-surface) border-b border-(--color-border) sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-(--color-text) no-underline">
            <span className="text-2xl">🌤️</span>
            <span className="hidden sm:inline">Weather Dashboard</span>
            <span className="sm:hidden">Weather</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium no-underline transition-colors ${
                  location.pathname === link.to
                    ? 'bg-blue-500 text-white'
                    : 'text-(--color-text-secondary) hover:bg-(--color-border) hover:text-(--color-text)'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Unit Toggle */}
            <button
              onClick={() =>
                setTemperatureUnit(temperatureUnit === 'metric' ? 'imperial' : 'metric')
              }
              className="px-2 py-1 rounded-md text-sm font-medium bg-(--color-bg) text-(--color-text) border border-(--color-border) hover:border-blue-400 transition-colors cursor-pointer"
              aria-label="Toggle temperature unit"
            >
              °{temperatureUnit === 'metric' ? 'C' : 'F'}
            </button>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
