# Meet me alpha access setup

## Purpose
Use invite-only access and a waitlist while the product is still in closed alpha.

## Setup
Run:
- `supabase/schema.sql`
- `supabase/rls.sql`
- `supabase/network_extensions.sql`
- `supabase/network_rollups.sql`
- `supabase/feedback.sql`
- `supabase/alpha_access.sql`

## Pages added
- `/waitlist`
- `/admin/alpha-access`

## Recommended flow
1. Users without access join the waitlist
2. Admin reviews requests
3. Admin approves selected emails for alpha
4. Approved users get invite codes or direct onboarding
