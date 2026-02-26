import { useAppContext } from '../context/AppContext';

export default function ThemeToggle() {
  const { state, setDarkMode } = useAppContext();
  const isDark = state.settings.darkMode;

  return (
    <button
      onClick={() => setDarkMode(!isDark)}
      className="relative w-12 h-7 rounded-full bg-(--color-border) transition-colors duration-300 cursor-pointer border-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      role="switch"
      aria-checked={isDark}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 flex items-center justify-center text-sm ${
          isDark ? 'translate-x-5' : 'translate-x-0'
        }`}
      >
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
