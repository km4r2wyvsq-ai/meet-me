import { supabase, supabaseEnabled } from '@/lib/supabase/client';

function requireClient() {
  if (!supabaseEnabled || !supabase) throw new Error('Supabase is not enabled.');
  return supabase;
}

export type CreatorMetricRow = {
  groupId: string;
  groupName: string;
  metricDate: string;
  invitesCreated: number;
  invitesAccepted: number;
  postsCreated: number;
  commentsReceived: number;
};

export async function getCreatorMetrics() : Promise<CreatorMetricRow[]> {
  const client = requireClient();
  const { data: authData } = await client.auth.getUser();
  const user = authData.user;
  if (!user) return [];

  const { data, error } = await client
    .from('creator_daily_metrics')
    .select('group_id, metric_date, invites_created, invites_accepted, posts_created, comments_received, groups(name)')
    .eq('profile_id', user.id)
    .order('metric_date', { ascending: false })
    .limit(30);

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    groupId: row.group_id,
    groupName: row.groups?.name ?? 'Group',
    metricDate: row.metric_date,
    invitesCreated: row.invites_created ?? 0,
    invitesAccepted: row.invites_accepted ?? 0,
    postsCreated: row.posts_created ?? 0,
    commentsReceived: row.comments_received ?? 0
  }));
}
