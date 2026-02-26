import CitySearch from '../components/CitySearch';
import WeatherCard from '../components/WeatherCard';
import { useAppContext } from '../context/AppContext';

export default function Dashboard() {
  const { state } = useAppContext();
  const { cities } = state;

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <section className="flex flex-col items-center text-center py-4 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-(--color-text) mb-2">
          Weather Dashboard
        </h1>
        <p className="text-(--color-text-secondary) mb-6 text-sm sm:text-base">
          Search and track weather for cities worldwide
        </p>
        <CitySearch />
      </section>

      {/* Weather Cards */}
      {cities.length === 0 ? (
        <EmptyState />
      ) : (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-(--color-text)">
              Your Cities ({cities.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {cities.map((city) => (
              <WeatherCard key={city.id} city={city} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 sm:py-24">
      <div className="text-6xl mb-4">🌍</div>
      <h2 className="text-xl font-semibold text-(--color-text) mb-2">
        No cities added yet
      </h2>
      <p className="text-(--color-text-secondary) max-w-md mx-auto">
        Search for a city above to start tracking weather conditions. Your saved cities will appear here.
      </p>
    </div>
  );
}
