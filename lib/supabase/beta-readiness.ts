import { supabase, supabaseEnabled } from '@/lib/supabase/client';

function requireClient() {
  if (!supabaseEnabled || !supabase) throw new Error('Supabase is not enabled.');
  return supabase;
}

function makeToken(email: string) {
  return `BETA-${email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export type BetaInviteRow = {
  id: string;
  email: string;
  source: string;
  state: 'draft' | 'sent' | 'accepted' | 'expired';
  inviteToken: string;
  notes: string;
  createdAt: string;
};

export type OnboardingEventRow = {
  id: string;
  email: string;
  eventName: string;
  eventDetail: string;
  createdAt: string;
};

export async function getBetaInvites(): Promise<BetaInviteRow[]> {
  const client = requireClient();
  const { data, error } = await client
    .from('beta_invites')
    .select('id, email, source, state, invite_token, notes, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    email: row.email,
    source: row.source,
    state: row.state,
    inviteToken: row.invite_token,
    notes: row.notes ?? '',
    createdAt: new Date(row.created_at).toLocaleString()
  }));
}

export async function createBetaInvite(email: string, source = 'waitlist', notes = '') {
  const client = requireClient();
  const token = makeToken(email);
  const { error } = await client.from('beta_invites').upsert({
    email,
    source,
    state: 'draft',
    invite_token: token,
    notes
  });
  if (error) throw error;
  return token;
}

export async function updateBetaInviteState(id: string, state: BetaInviteRow['state']) {
  const client = requireClient();
  const { error } = await client.from('beta_invites').update({ state }).eq('id', id);
  if (error) throw error;
}

export async function logOnboardingEvent(email: string, eventName: string, eventDetail = '') {
  const client = requireClient();
  const { error } = await client.from('onboarding_events').insert({
    email,
    event_name: eventName,
    event_detail: eventDetail
  });
  if (error) throw error;
}

export async function getOnboardingEvents(): Promise<OnboardingEventRow[]> {
  const client = requireClient();
  const { data, error } = await client
    .from('onboarding_events')
    .select('id, email, event_name, event_detail, created_at')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    email: row.email,
    eventName: row.event_name,
    eventDetail: row.event_detail ?? '',
    createdAt: new Date(row.created_at).toLocaleString()
  }));
}
