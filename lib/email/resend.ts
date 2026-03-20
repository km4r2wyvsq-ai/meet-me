import { Resend } from 'resend';
import { serverEmailConfigured, getServerEnv } from '@/lib/env.server';

function getClient() {
  if (!serverEmailConfigured()) return null;
  return new Resend(getServerEnv('RESEND_API_KEY'));
}

export async function sendAlphaAlertEmail(input: {
  to: string;
  subject: string;
  html: string;
}) {
  const client = getClient();
  if (!client) {
    return { ok: false as const, reason: 'Email provider not configured' };
  }

  const from = getServerEnv('ALERTS_FROM_EMAIL');

  const result = await client.emails.send({
    from,
    to: [input.to],
    subject: input.subject,
    html: input.html
  });

  return { ok: true as const, result };
}
