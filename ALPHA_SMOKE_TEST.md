# Meet me alpha smoke test

## API checks
- GET /api/health
- GET /api/health/deep
- POST /api/admin/test-alert
- POST /api/admin/smoke-test

## Manual browser checks
- sign up / sign in / sign out
- create post
- like and comment on post
- join and leave group
- open group chat and send message
- create invite and accept invite
- follow and unfollow user
- open profile, activity, creator, launch, qa, and status pages

## Pass criteria
- no fatal navigation errors
- no broken routes
- unread alert counts update
- state persists correctly in demo mode
