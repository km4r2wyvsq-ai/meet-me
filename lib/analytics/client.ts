'use client';

import posthog from 'posthog-js';

let initialized = false;

export function analyticsEnabled() {
  return process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' && Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);
}

export function initAnalytics() {
  if (initialized || !analyticsEnabled()) return;
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    capture_pageview: true,
    persistence: 'localStorage'
  });
  initialized = true;
}

export function identifyUser(userId: string, properties?: Record<string, string | number | boolean>) {
  if (!analyticsEnabled()) return;
  initAnalytics();
  posthog.identify(userId, properties);
}

export function captureEvent(name: string, properties?: Record<string, string | number | boolean>) {
  if (!analyticsEnabled()) return;
  initAnalytics();
  posthog.capture(name, properties);
}

export function resetAnalytics() {
  if (!analyticsEnabled()) return;
  posthog.reset();
}
