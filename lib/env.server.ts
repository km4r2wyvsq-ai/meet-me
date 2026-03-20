export function getServerEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }
  return value;
}

export function serverEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY) && Boolean(process.env.ALERTS_FROM_EMAIL);
}

export function sentryConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN);
}
