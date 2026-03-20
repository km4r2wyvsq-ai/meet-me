# Meet me production checklist

## Real auth and permissions
- enable Supabase Auth
- run `supabase/schema.sql`
- run `supabase/rls.sql`
- replace demo role switching with role lookup from profile or membership tables
- protect admin actions on the server, not only in the UI

## Analytics
- turn on PostHog in `.env.local`
- identify users after signup/login
- capture activation events:
  - signup_completed
  - interest_selected
  - group_joined
  - first_post_created
  - first_message_sent
- create dashboards for activation, retention, and group health

## Notifications
- move notification creation to real database-backed events
- add email delivery for moderation and activity digests

## Moderation
- persist reports and admin actions in Supabase
- add admin notes and moderation history
- limit admin access to allowed roles only
