import { NextResponse } from 'next/server';

export async function GET() {
  const checks = {
    app: 'ok',
    environment: process.env.NODE_ENV || 'development',
    supabaseUrlConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    supabaseAnonConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    posthogConfigured: Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY),
    sentryConfigured: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
    resendConfigured: Boolean(process.env.RESEND_API_KEY),
    alertsFromConfigured: Boolean(process.env.ALERTS_FROM_EMAIL),
  };

  const ok = checks.app === 'ok';
  return NextResponse.json({
    ok,
    checks,
    timestamp: new Date().toISOString()
  });
}
