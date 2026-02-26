import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ThemeToggle from '../components/ThemeToggle';
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

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorageMock.clear();
    document.documentElement.classList.remove('dark');
  });

  it('renders the toggle button', () => {
    renderWithProvider(<ThemeToggle />);
    const button = screen.getByRole('switch');
    expect(button).toBeInTheDocument();
  });

  it('has correct aria-label for light mode', () => {
    renderWithProvider(<ThemeToggle />);
    const button = screen.getByRole('switch');
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    expect(button).toHaveAttribute('aria-checked', 'false');
  });

  it('toggles dark mode on click', async () => {
    const user = userEvent.setup();
    renderWithProvider(<ThemeToggle />);
    const button = screen.getByRole('switch');

    await user.click(button);

    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
    expect(button).toHaveAttribute('aria-checked', 'true');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('toggles back to light mode on second click', async () => {
    const user = userEvent.setup();
    renderWithProvider(<ThemeToggle />);
    const button = screen.getByRole('switch');

    await user.click(button);
    await user.click(button);

    expect(button).toHaveAttribute('aria-checked', 'false');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('persists dark mode preference to localStorage', async () => {
    const user = userEvent.setup();
    renderWithProvider(<ThemeToggle />);
    const button = screen.getByRole('switch');

    await user.click(button);

    const saved = JSON.parse(localStorageMock.getItem('weather-dashboard-settings') || '{}');
    expect(saved.darkMode).toBe(true);
  });
});
