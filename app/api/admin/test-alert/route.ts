import { NextResponse } from 'next/server';
import { sendAlphaAlertEmail } from '@/lib/email/resend';

export async function POST() {
  const target = process.env.ALERTS_FROM_EMAIL || 'alerts@meetme.app';
  const result = await sendAlphaAlertEmail({
    to: target,
    subject: 'Meet me alpha alert test',
    html: '<strong>Meet me test alert</strong><p>Your alert pipeline is configured.</p>'
  });

  return NextResponse.json({
    ok: true,
    emailConfigured: result.ok,
    message: result.ok
      ? 'Test alert attempted through Resend.'
      : 'Email provider is not configured yet.'
  });
}
