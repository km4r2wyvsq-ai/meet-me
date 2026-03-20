'use client';

import { useEffect } from 'react';
import { initAnalytics } from '@/lib/analytics/client';

export function AnalyticsProvider() {
  useEffect(() => {
    initAnalytics();
  }, []);

  return null;
}
