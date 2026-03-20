# Meet me first functional web alpha

This is the closest package to a real first functional version of the web app.

## What "functional" means here
After setup, you should have:
- auth
- profile setup
- group discovery and joining
- post creation
- comments and likes
- group chat
- notifications
- invite creation and acceptance
- feedback submission
- launch / QA / status dashboards

## Exact setup order
1. Install dependencies
   - `npm install`

2. Create environment file
   - copy `.env.example` to `.env.local`

3. Enable Supabase mode in `.env.local`
   - `NEXT_PUBLIC_ENABLE_SUPABASE=true`
   - `NEXT_PUBLIC_SUPABASE_URL=...`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`

4. Run SQL files in this order
   - `supabase/schema.sql`
   - `supabase/rls.sql`
   - `supabase/network_extensions.sql`
   - `supabase/network_rollups.sql`
   - `supabase/feedback.sql`
   - `supabase/seed_alpha.sql`

5. Create the storage bucket in Supabase
   - `media`

6. Enable Realtime on these tables
   - posts
   - comments
   - likes
   - messages
   - notifications
   - reports

7. Start the app
   - `npm run dev`

## First routes to verify
- `/home`
- `/discover`
- `/activity`
- `/creator`
- `/launch-dashboard`
- `/qa`
- `/status`
- `/feedback`
- `/admin/feedback`
- `/admin/feedback-analytics`
- `/api/health`
- `/api/health/deep`

## First manual flow to test
1. create an account
2. set interests
3. join a group
4. create a post
5. like and comment on a post
6. open group chat and send a message
7. create an invite
8. accept an invite
9. submit feedback
10. open status and launch dashboards

## What is still not fully complete
- production deployment by me is not done here
- push/email notifications are not fully finished
- Sentry still needs credentials and package verification
- final legal review is not done
- final QA needs to be executed in a real environment

## Best definition of your first functional version
The first functional version is the web alpha package in this folder, once the setup above is completed and verified locally or on a staging deployment.
