# Meet me network backend plan

This build adds the code and schema path for a real network layer.

## New backend entities
- follows
- invites
- invite_acceptances

## Product flows enabled
- follow / unfollow users
- public profile relationship state
- invite creation
- invite acceptance
- fanout-ready notifications

## Next backend work
- wire follows and invites into the main store in Supabase mode
- send creator notifications when invite links are accepted
- add follower activity feed
- add profile recommendations based on mutual graph signals
