import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import CitySearch from '../components/CitySearch';
import { AppProvider } from '../context/AppContext';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

function renderWithProvider(ui: React.ReactElement) {
  return render(<AppProvider>{ui}</AppProvider>);
}

describe('CitySearch', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('renders the search input', () => {
    renderWithProvider(<CitySearch />);
    const input = screen.getByPlaceholderText('Search for a city...');
    expect(input).toBeInTheDocument();
  });

  it('has correct aria-label', () => {
    renderWithProvider(<CitySearch />);
    const input = screen.getByLabelText('Search for a city');
    expect(input).toBeInTheDocument();
  });

  it('shows validation error for single character', async () => {
    const user = userEvent.setup();
    renderWithProvider(<CitySearch />);
    const input = screen.getByPlaceholderText('Search for a city...');

    await user.type(input, 'a');

    expect(screen.getByText('Enter at least 2 characters')).toBeInTheDocument();
  });

  it('shows validation error for invalid characters', async () => {
    const user = userEvent.setup();
    renderWithProvider(<CitySearch />);
    const input = screen.getByPlaceholderText('Search for a city...');

    await user.type(input, '123');

    expect(screen.getByText('Only letters, spaces, hyphens, and commas allowed')).toBeInTheDocument();
  });

  it('shows validation error when submitting empty form', async () => {
    const user = userEvent.setup();
    renderWithProvider(<CitySearch />);
    const input = screen.getByPlaceholderText('Search for a city...');

    input.focus();
    await user.keyboard('{Enter}');

    expect(screen.getByText('Please enter a city name')).toBeInTheDocument();
  });

  it('clears validation error when valid input is typed', async () => {
    const user = userEvent.setup();
    renderWithProvider(<CitySearch />);
    const input = screen.getByPlaceholderText('Search for a city...');

    await user.type(input, '12');
    expect(screen.getByText('Only letters, spaces, hyphens, and commas allowed')).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, 'Lo');

    expect(screen.queryByText('Only letters, spaces, hyphens, and commas allowed')).not.toBeInTheDocument();
  });

  it('sets aria-invalid when validation error exists', async () => {
    const user = userEvent.setup();
    renderWithProvider(<CitySearch />);
    const input = screen.getByPlaceholderText('Search for a city...');

    await user.type(input, 'a');

    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});
