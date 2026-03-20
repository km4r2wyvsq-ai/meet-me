'use client';

export function captureClientError(error: unknown, context?: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined') return;
  try {
    const maybeSentry = (window as any).Sentry;
    if (maybeSentry?.captureException) {
      maybeSentry.captureException(error, { extra: context });
      return;
    }
  } catch {}
  console.error('Meet me client error', error, context);
}

export async function pingHealth() {
  const response = await fetch('/api/health', { cache: 'no-store' });
  if (!response.ok) throw new Error('Health endpoint failed');
  return response.json();
}
