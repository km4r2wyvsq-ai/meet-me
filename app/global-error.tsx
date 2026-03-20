'use client';

import * as Sentry from '@sentry/nextjs';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  try {
    Sentry.captureException(error);
  } catch {}

  return (
    <html>
      <body>
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
          <div style={{ maxWidth: 560, width: '100%', background: 'white', border: '1px solid #e5e7eb', borderRadius: 24, padding: 24 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#111827' }}>Something went wrong</div>
            <p style={{ marginTop: 12, color: '#64748b' }}>
              Meet me hit an unexpected error. This event can be captured by monitoring if Sentry is configured.
            </p>
            <button
              onClick={() => reset()}
              style={{ marginTop: 16, border: 0, borderRadius: 16, background: '#7c3aed', color: 'white', padding: '12px 16px', fontWeight: 700 }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
