import { NextResponse } from 'next/server';
import { supabaseConfigured } from '@/lib/env';
import { submitFeedback } from '@/lib/supabase/feedback';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.category || !body?.message) {
    return NextResponse.json({ ok: false, message: 'Missing feedback fields.' }, { status: 400 });
  }

  if (!supabaseConfigured()) {
    return NextResponse.json({
      ok: true,
      stored: false,
      received: body,
      message: 'Feedback endpoint is ready. Enable Supabase to persist feedback_items.'
    });
  }

  try {
    await submitFeedback({
      category: body.category,
      message: body.message,
      page: body.page || ''
    });

    return NextResponse.json({
      ok: true,
      stored: true,
      message: 'Feedback stored successfully.'
    });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      stored: false,
      message: error?.message || 'Could not store feedback.'
    }, { status: 500 });
  }
}
