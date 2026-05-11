/* NEW FILE — app/[locale]/error.tsx */
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to Sentry when integrated
    console.error('Route error:', error);
  }, [error]);

  return (
    <main style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      gap: '1.5rem',
      fontFamily: 'var(--font-body)',
    }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-obsidian)' }}>
        Something went wrong
      </h1>
      <p style={{ color: 'var(--color-stone)' }}>
        We encountered an unexpected error. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        style={{
          padding: '0.75rem 1.5rem',
          background: 'var(--color-gold)',
          color: 'var(--color-ivory)',
          borderRadius: '8px',
          border: 'none',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Try again
      </button>
    </main>
  );
}