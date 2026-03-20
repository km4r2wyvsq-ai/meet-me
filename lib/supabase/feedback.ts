import { supabase, supabaseEnabled } from '@/lib/supabase/client';
import type { FeedbackCategory, FeedbackItem, FeedbackStatus } from '@/lib/types';

function requireClient() {
  if (!supabaseEnabled || !supabase) throw new Error('Supabase is not enabled.');
  return supabase;
}

async function getAuthUser() {
  const client = requireClient();
  const { data } = await client.auth.getUser();
  return data.user;
}

export async function submitFeedback(input: {
  category: FeedbackCategory;
  message: string;
  page: string;
}) {
  const client = requireClient();
  const user = await getAuthUser();
  if (!user) throw new Error('No signed-in user.');

  const { error } = await client.from('feedback_items').insert({
    profile_id: user.id,
    email: user.email ?? '',
    category: input.category,
    message: input.message,
    page: input.page
  });
  if (error) throw error;

  await client.from('audit_events').insert({
    profile_id: user.id,
    event_name: 'feedback_submitted',
    detail: `Submitted ${input.category} feedback for ${input.page}.`
  });
}

export async function getMyFeedback(): Promise<FeedbackItem[]> {
  const client = requireClient();
  const user = await getAuthUser();
  if (!user) return [];

  const { data, error } = await client
    .from('feedback_items')
    .select('id, category, message, page, status, created_at, email')
    .eq('profile_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    category: row.category,
    message: row.message,
    page: row.page ?? '',
    status: row.status,
    createdAt: new Date(row.created_at).toLocaleString(),
    email: row.email ?? ''
  }));
}

export async function getAdminFeedback(): Promise<FeedbackItem[]> {
  const client = requireClient();
  const { data, error } = await client
    .from('feedback_items')
    .select('id, category, message, page, status, created_at, email')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    category: row.category,
    message: row.message,
    page: row.page ?? '',
    status: row.status,
    createdAt: new Date(row.created_at).toLocaleString(),
    email: row.email ?? ''
  }));
}

export async function updateFeedbackStatus(id: string, status: FeedbackStatus) {
  const client = requireClient();
  const { error } = await client.from('feedback_items').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function getFeedbackSummary() {
  const client = requireClient();
  const { data, error } = await client
    .from('feedback_items')
    .select('id, category, status, page, created_at')
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) throw error;

  const rows = data ?? [];
  const byCategory = {
    bug: 0,
    idea: 0,
    ux: 0,
    performance: 0,
    other: 0
  } as Record<FeedbackCategory, number>;

  const byStatus = {
    new: 0,
    reviewed: 0,
    planned: 0,
    closed: 0
  } as Record<FeedbackStatus, number>;

  const byPage = new Map<string, number>();

  for (const row of rows as any[]) {
    if (row.category in byCategory) byCategory[row.category as FeedbackCategory] += 1;
    if (row.status in byStatus) byStatus[row.status as FeedbackStatus] += 1;
    const page = row.page || 'unknown';
    byPage.set(page, (byPage.get(page) || 0) + 1);
  }

  return {
    total: rows.length,
    byCategory,
    byStatus,
    topPages: Array.from(byPage.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([page, count]) => ({ page, count }))
  };
}
