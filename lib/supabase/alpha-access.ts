import { supabase, supabaseEnabled } from '@/lib/supabase/client';
import type { AlphaAccessItem, WaitlistRequestItem, AlphaAccessState, WaitlistStatus } from '@/lib/types';

function requireClient() {
  if (!supabaseEnabled || !supabase) throw new Error('Supabase is not enabled.');
  return supabase;
}

async function getAuthUser() {
  const client = requireClient();
  const { data } = await client.auth.getUser();
  return data.user;
}

export async function submitWaitlistRequest(input: {
  email: string;
  name: string;
  context: string;
}) {
  const client = requireClient();
  const { error } = await client.from('waitlist_requests').upsert({
    email: input.email,
    name: input.name,
    context: input.context,
    status: 'new'
  });
  if (error) throw error;
}

export async function getWaitlistRequests(): Promise<WaitlistRequestItem[]> {
  const client = requireClient();
  const { data, error } = await client
    .from('waitlist_requests')
    .select('id, email, name, context, status, created_at')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    email: row.email,
    name: row.name ?? '',
    context: row.context ?? '',
    status: row.status,
    createdAt: new Date(row.created_at).toLocaleString()
  }));
}

export async function updateWaitlistStatus(id: string, status: WaitlistStatus) {
  const client = requireClient();
  const { error } = await client.from('waitlist_requests').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function getAlphaAccessList(): Promise<AlphaAccessItem[]> {
  const client = requireClient();
  const { data, error } = await client
    .from('alpha_access')
    .select('id, email, access_state, invite_code, note, created_at')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    email: row.email,
    accessState: row.access_state,
    inviteCode: row.invite_code ?? '',
    note: row.note ?? '',
    createdAt: new Date(row.created_at).toLocaleString()
  }));
}

export async function upsertAlphaAccess(input: {
  email: string;
  accessState: AlphaAccessState;
  inviteCode?: string;
  note?: string;
}) {
  const client = requireClient();
  const { error } = await client.from('alpha_access').upsert({
    email: input.email,
    access_state: input.accessState,
    invite_code: input.inviteCode ?? null,
    note: input.note ?? ''
  });
  if (error) throw error;
}

export async function getMyAlphaAccess(): Promise<AlphaAccessItem | null> {
  const client = requireClient();
  const user = await getAuthUser();
  if (!user?.email) return null;

  const { data, error } = await client
    .from('alpha_access')
    .select('id, email, access_state, invite_code, note, created_at')
    .eq('email', user.email)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    email: data.email,
    accessState: data.access_state,
    inviteCode: data.invite_code ?? '',
    note: data.note ?? '',
    createdAt: new Date(data.created_at).toLocaleString()
  };
}
