# Meet me deployment guide

## Recommended stack
- Vercel or Docker-based Node hosting
- Supabase for auth, database, storage, and realtime
- PostHog for product analytics
- Sentry for error monitoring

## Required environment variables
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- NEXT_PUBLIC_ENABLE_SUPABASE
- NEXT_PUBLIC_ENABLE_ANALYTICS
- NEXT_PUBLIC_POSTHOG_KEY
- NEXT_PUBLIC_POSTHOG_HOST

## Backend setup
Run:
- supabase/schema.sql
- supabase/rls.sql
- supabase/network_extensions.sql
- supabase/network_rollups.sql

Enable Realtime on:
- posts
- comments
- likes
- messages
- notifications
- reports

Create storage bucket:
- media

## Pre-launch checks
- confirm `/api/health` returns ok
- verify login/signup in production
- verify uploads
- verify legal pages are reachable
- verify creator and launch dashboards load
