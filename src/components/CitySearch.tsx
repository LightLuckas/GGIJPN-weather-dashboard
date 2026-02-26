import { useState, useRef, useEffect } from 'react';
import { useCitySearch } from '../hooks/useCitySearch';
import { useAppContext } from '../context/AppContext';
import type { GeocodingResult } from '../types';

interface CitySearchProps {
  onCitySelect?: (city: GeocodingResult) => void;
}

export default function CitySearch({ onCitySelect }: CitySearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { results, isSearching, searchError, search, clearResults } = useCitySearch();
  const { addCity } = useAppContext();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleInputChange(value: string) {
    setQuery(value);
    setValidationError(null);

    if (value.trim().length < 2) {
      setValidationError(value.trim().length > 0 ? 'Enter at least 2 characters' : null);
      clearResults();
      setIsOpen(false);
      return;
    }

    if (!/^[a-zA-Z\s\-,.]+$/.test(value.trim())) {
      setValidationError('Only letters, spaces, hyphens, and commas allowed');
      return;
    }

    search(value);
    setIsOpen(true);
  }

  function handleSelect(city: GeocodingResult) {
    addCity({
      name: city.name,
      country: city.country,
      lat: city.lat,
      lon: city.lon,
    });
    onCitySelect?.(city);
    setQuery('');
    clearResults();
    setIsOpen(false);
    inputRef.current?.blur();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) {
      setValidationError('Please enter a city name');
      return;
    }
    if (query.trim().length < 2) {
      setValidationError('Enter at least 2 characters');
      return;
    }
    if (results.length > 0) {
      handleSelect(results[0]);
    }
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative" role="search">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary) text-lg">
            🔍
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            placeholder="Search for a city..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-(--color-surface) border border-(--color-border) text-(--color-text) placeholder-(--color-text-secondary) focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm sm:text-base"
            aria-label="Search for a city"
            aria-describedby={validationError ? 'search-error' : undefined}
            aria-invalid={!!validationError}
            autoComplete="off"
          />
          {isSearching && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className="inline-block w-5 h-5 border-2 border-(--color-border) border-t-blue-500 rounded-full animate-spin" />
            </span>
          )}
        </div>

        {/* Validation Error */}
        {validationError && (
          <p id="search-error" className="mt-1 text-sm text-red-500" role="alert">
            {validationError}
          </p>
        )}

        {/* Search Error */}
        {searchError && !validationError && (
          <p className="mt-1 text-sm text-amber-500" role="alert">
            {searchError}
          </p>
        )}
      </form>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-(--color-surface) border border-(--color-border) rounded-xl shadow-lg overflow-hidden z-50 max-h-60 overflow-y-auto">
          {results.map((city, index) => (
            <li key={`${city.lat}-${city.lon}-${index}`}>
              <button
                type="button"
                onClick={() => handleSelect(city)}
                className="w-full px-4 py-3 text-left hover:bg-(--color-bg) transition-colors flex items-center justify-between border-none bg-transparent text-(--color-text) cursor-pointer"
              >
                <div>
                  <span className="font-medium">{city.name}</span>
                  {city.state && (
                    <span className="text-(--color-text-secondary) ml-1">, {city.state}</span>
                  )}
                </div>
                <span className="text-sm text-(--color-text-secondary) bg-(--color-bg) px-2 py-0.5 rounded">
                  {city.country}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
