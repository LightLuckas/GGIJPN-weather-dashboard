import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-24">
      <div className="text-6xl mb-4">🌧️</div>
      <h1 className="text-4xl font-bold text-(--color-text) mb-2">404</h1>
      <p className="text-(--color-text-secondary) mb-6 text-lg">
        Page not found — looks like a storm blew it away!
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors no-underline font-medium"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
