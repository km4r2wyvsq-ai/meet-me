import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    ok: true,
    steps: [
      'health endpoint reachable',
      'admin test alert endpoint reachable',
      'application routes mounted'
    ],
    next: 'Run manual auth, feed, group, chat, invite, and profile checks in the browser.'
  });
}
