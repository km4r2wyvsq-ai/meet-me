# Meet me staging launch guide

This is the next step after the first functional web alpha package.

## Goal
Bring Meet me up in a real staging environment so you can:
- test the full web flow outside localhost
- invite a few testers
- verify auth, uploads, realtime, and dashboards
- prepare for a closed alpha rollout

## Recommended staging stack
- frontend: Vercel
- backend/data: Supabase
- monitoring: Sentry
- product analytics: PostHog
- transactional email: Resend

## Exact staging order

### 1. Create staging environment
Create these environments:
- local
- staging
- production later

### 2. Configure Supabase
Run:
- `supabase/schema.sql`
- `supabase/rls.sql`
- `supabase/network_extensions.sql`
- `supabase/network_rollups.sql`
- `supabase/feedback.sql`
- `supabase/seed_alpha.sql`

Then:
- create bucket `media`
- enable Realtime for:
  - posts
  - comments
  - likes
  - messages
  - notifications
  - reports

### 3. Configure Vercel env vars
Use the template in:
- `VERCEL_ENV_SETUP.md`

### 4. Deploy staging
- connect repo to Vercel
- set staging environment variables
- deploy preview or staging branch
- verify `/api/health`
- verify `/api/health/deep`

### 5. Run the smoke flow
Use:
- `STAGING_SMOKE_TEST.md`

### 6. Invite first testers
Recommended first batch:
- 5 to 10 people only
- 1 founder/admin
- 2 creators
- 2 to 7 normal users

## Staging success criteria
- signup works
- login works
- group join works
- post create works
- comment/like works
- chat works
- feedback submit works
- creator / launch / qa / status pages load
- no blocking auth or database errors

## After staging is stable
Move to closed alpha, not public launch.
