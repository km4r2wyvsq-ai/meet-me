# Meet me Vercel environment setup

## Required public variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_STORAGE_BUCKET=media`
- `NEXT_PUBLIC_ENABLE_SUPABASE=true`

## Optional analytics
- `NEXT_PUBLIC_ENABLE_ANALYTICS=true`
- `NEXT_PUBLIC_POSTHOG_KEY=...`
- `NEXT_PUBLIC_POSTHOG_HOST=...`

## Monitoring
- `NEXT_PUBLIC_SENTRY_DSN=...`
- `SENTRY_ORG=...`
- `SENTRY_PROJECT=...`
- `SENTRY_AUTH_TOKEN=...`

## Email
- `RESEND_API_KEY=...`
- `ALERTS_FROM_EMAIL=...`

## Recommended Vercel env split
### Preview / staging
- enable Supabase
- enable analytics if available
- enable Sentry if available
- optionally leave email off at first

### Production later
- separate Supabase project or production data isolation
- final email config
- final monitoring config
