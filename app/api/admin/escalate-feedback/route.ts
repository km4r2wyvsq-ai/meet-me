import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  return NextResponse.json({
    ok: true,
    message: 'Escalation endpoint scaffolded. Next step is wiring urgent bug reports to email or pager delivery.',
    received: {
      feedbackId: body.feedbackId || null,
      reason: body.reason || 'urgent_bug'
    }
  });
}
