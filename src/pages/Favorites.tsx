import WeatherCard from '../components/WeatherCard';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const { state } = useAppContext();
  const favoriteCities = state.cities.filter((city) => city.isFavorite);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-(--color-text)">
          Favorite Cities
        </h1>
        <p className="text-(--color-text-secondary) mt-1">
          Your starred locations for quick access
        </p>
      </div>

      {favoriteCities.length === 0 ? (
        <div className="text-center py-16 sm:py-24">
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="text-xl font-semibold text-(--color-text) mb-2">
            No favorite cities yet
          </h2>
          <p className="text-(--color-text-secondary) max-w-md mx-auto mb-4">
            Star cities from the dashboard to add them to your favorites for quick access.
          </p>
          <Link
            to="/"
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors no-underline text-sm font-medium"
          >
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {favoriteCities.map((city) => (
            <WeatherCard key={city.id} city={city} />
          ))}
        </div>
      )}
    </div>
  );
}
