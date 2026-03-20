# Meet me staging smoke test

## API checks
Open:
- `/api/health`
- `/api/health/deep`

POST:
- `/api/admin/smoke-test`
- `/api/admin/test-alert`

## Core user flow
1. sign up
2. select interests
3. join a group
4. create a post
5. like a post
6. comment on a post
7. open chat
8. send a message
9. create invite
10. accept invite
11. submit feedback

## Operator flow
Open:
- `/status`
- `/qa`
- `/launch-dashboard`
- `/creator`
- `/admin/feedback`
- `/admin/feedback-analytics`

## Pass result
- no broken routes
- no fatal console/server errors
- no RLS failures
- uploads work if enabled
- realtime behaves acceptably
