# Meet me referral attribution plan

This build adds the schema and helper path for referral attribution.

## Added now
- referral_events table
- creator_daily_metrics table
- backend helpers for invite acceptance attribution
- creator analytics page

## What to finish next
- increment creator metrics from invite creation, invite acceptance, and post activity
- wire network helpers directly into the main store in Supabase mode
- add per-invite conversion rate cards
- add push/email fanout based on invite and follow activity
