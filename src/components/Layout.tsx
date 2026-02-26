import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <div className="min-h-screen bg-(--color-bg) transition-colors duration-300">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
      <footer className="text-center py-6 text-(--color-text-secondary) text-sm border-t border-(--color-border)">
        <p>Weather Dashboard — Powered by OpenWeatherMap</p>
      </footer>
    </div>
  );
}
