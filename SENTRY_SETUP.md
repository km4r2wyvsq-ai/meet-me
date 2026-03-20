# Meet me Sentry setup

## Environment variables
- NEXT_PUBLIC_SENTRY_DSN
- SENTRY_ORG
- SENTRY_PROJECT
- SENTRY_AUTH_TOKEN

## What is included
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `instrumentation.ts`

## Next steps
1. install `@sentry/nextjs`
2. set the environment variables
3. verify client and server errors appear in Sentry
4. add release tracking for deployments
