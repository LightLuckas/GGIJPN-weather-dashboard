import { useState, useCallback, useRef } from 'react';
import type { GeocodingResult } from '../types';
import { searchCities } from '../services/weatherApi';

interface UseCitySearchResult {
  results: GeocodingResult[];
  isSearching: boolean;
  searchError: string | null;
  search: (query: string) => void;
  clearResults: () => void;
}

export function useCitySearch(): UseCitySearchResult {
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const search = useCallback((query: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setSearchError(null);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);

      try {
        const data = await searchCities(query);
        setResults(data);
        if (data.length === 0) {
          setSearchError('No cities found. Try a different search.');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Search failed';
        setSearchError(message);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setSearchError(null);
  }, []);

  return { results, isSearching, searchError, search, clearResults };
}
