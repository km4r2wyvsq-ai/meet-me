# Meet me feedback backend plan

This build adds the full persistence path for feedback.

## Added now
- feedback item types
- Supabase helper functions for:
  - submit feedback
  - load my feedback
  - load admin feedback
  - update feedback status
- feedback API route uses Supabase when configured
- feedback center can show a user's own submissions
- admin feedback inbox can load and update statuses

## Next step
- add charts for feedback category volume
- add issue export flow
- connect urgent bug reports to alerting
