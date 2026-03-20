import { NextResponse } from 'next/server';
import { supabaseConfigured } from '@/lib/env';
import { submitWaitlistRequest } from '@/lib/supabase/alpha-access';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.email) {
    return NextResponse.json({ ok: false, message: 'Missing email.' }, { status: 400 });
  }

  if (!supabaseConfigured()) {
    return NextResponse.json({
      ok: true,
      stored: false,
      message: 'Waitlist endpoint is ready. Enable Supabase to persist waitlist requests.'
    });
  }

  try {
    await submitWaitlistRequest({
      email: body.email,
      name: body.name || '',
      context: body.context || ''
    });
    return NextResponse.json({ ok: true, stored: true, message: 'Waitlist request stored.' });
  } catch (error: any) {
    return NextResponse.json({ ok: false, message: error?.message || 'Could not store waitlist request.' }, { status: 500 });
  }
}
