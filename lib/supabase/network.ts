import { supabase, supabaseEnabled } from '@/lib/supabase/client';
import type { Follow, Invite, AnalyticsEvent, NotificationItem } from '@/lib/types';

function requireClient() {
  if (!supabaseEnabled || !supabase) throw new Error('Supabase is not enabled.');
  return supabase;
}

function makeInviteCode(groupName: string) {
  return `${groupName
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .slice(0, 12)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export async function getAuthUser() {
  const client = requireClient();
  const { data } = await client.auth.getUser();
  return data.user;
}

export async function getFollows(): Promise<Follow[]> {
  const client = requireClient();

  const { data, error } = await client
    .from('follows')
    .select(`
      follower:profiles!follows_follower_id_fkey(username),
      following:profiles!follows_following_id_fkey(username),
      created_at
    `);

  if (error) throw error;

  return (data ?? [])
    .map((row: any) => ({
      followerUsername: row.follower?.username ?? '',
      followingUsername: row.following?.username ?? '',
      createdAt: new Date(row.created_at).toLocaleString(),
    }))
    .filter((row: Follow) => row.followerUsername && row.followingUsername);
}

export async function toggleFollow(targetUsername: string) {
  const client = requireClient();
  const user = await getAuthUser();
  if (!user) throw new Error('No signed-in user.');

  const { data: viewerProfile, error: viewerError } = await client
    .from('profiles')
    .select('username, display_name')
    .eq('id', user.id)
    .single();

  if (viewerError) throw viewerError;

  const { data: target, error: targetError } = await client
    .from('profiles')
    .select('id, username, display_name')
    .eq('username', targetUsername)
    .single();

  if (targetError) throw targetError;

  const { data: existing, error: existingError } = await client
    .from('follows')
    .select('follower_id')
    .eq('follower_id', user.id)
    .eq('following_id', target.id)
    .maybeSingle();

  if (existingError) throw existingError;

  if (existing) {
    const { error } = await client
      .from('follows')
      .delete()
      .eq('follower_id', user.id)
      .eq('following_id', target.id);

    if (error) throw error;
    return { following: false };
  }

  const { error } = await client.from('follows').insert({
    follower_id: user.id,
    following_id: target.id,
  });

  if (error) throw error;

  await client.from('notifications').insert({
    profile_id: target.id,
    type: 'follow',
    title: 'New follower',
    body: `${viewerProfile.display_name || viewerProfile.username} started following you.`,
  });

  await client.from('audit_events').insert({
    profile_id: user.id,
    event_name: 'user_followed',
    detail: `Followed ${target.username}.`,
  });

  return { following: true };
}

export async function getInvites(): Promise<Invite[]> {
  const client = requireClient();

  const { data, error } = await client
    .from('invites')
    .select(`
      id,
      code,
      created_at,
      group_id,
      groups(name),
      invite_acceptances(id)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    groupId: row.group_id,
    groupName: Array.isArray(row.groups)
      ? (row.groups[0]?.name ?? 'Group')
      : (row.groups?.name ?? 'Group'),
    code: row.code,
    createdAt: new Date(row.created_at).toLocaleString(),
    acceptedCount: Array.isArray(row.invite_acceptances) ? row.invite_acceptances.length : 0,
  }));
}

export async function createInvite(groupId: string) {
  const client = requireClient();
  const user = await getAuthUser();
  if (!user) throw new Error('No signed-in user.');

  const { data: group, error: groupError } = await client
    .from('groups')
    .select('name')
    .eq('id', groupId)
    .single();

  if (groupError) throw groupError;

  const code = makeInviteCode(group.name);

  const { error } = await client.from('invites').insert({
    group_id: groupId,
    created_by: user.id,
    code,
  });

  if (error) throw error;

  await client.from('audit_events').insert({
    profile_id: user.id,
    event_name: 'invite_created',
    detail: `Created invite link for ${group.name}.`,
  });

  return code;
}

export async function acceptInvite(code: string) {
  const client = requireClient();
  const user = await getAuthUser();
  if (!user) throw new Error('No signed-in user.');

  const { data: invite, error: inviteError } = await client
    .from('invites')
    .select(`
      id,
      group_id,
      created_by,
      groups(name)
    `)
    .ilike('code', code.trim())
    .single();

  if (inviteError) throw inviteError;

  const groupName = Array.isArray(invite.groups)
    ? (invite.groups[0]?.name ?? 'a group')
    : (invite.groups?.name ?? 'a group');

  const { error: acceptanceError } = await client
    .from('invite_acceptances')
    .insert({ invite_id: invite.id, accepted_by: user.id });

  if (acceptanceError) throw acceptanceError;

  const { error: membershipError } = await client
    .from('group_members')
    .upsert({ group_id: invite.group_id, profile_id: user.id, role: 'member' });

  if (membershipError) throw membershipError;

  await client.from('referral_events').insert({
    invite_id: invite.id,
    inviter_id: invite.created_by,
    accepted_by: user.id,
    group_id: invite.group_id,
  });

  await client.from('notifications').insert([
    {
      profile_id: user.id,
      type: 'invite',
      title: 'Invite accepted',
      body: `You joined ${groupName}.`,
    },
    {
      profile_id: invite.created_by,
      type: 'invite',
      title: 'Your invite was used',
      body: `Someone joined ${groupName} using your invite link.`,
    },
  ]);

  await client.from('audit_events').insert([
    {
      profile_id: user.id,
      event_name: 'invite_accepted',
      detail: `Accepted invite for ${groupName}.`,
    },
    {
      profile_id: invite.created_by,
      event_name: 'invite_converted',
      detail: `An invite converted for ${groupName}.`,
    },
  ]);
}

export async function getNetworkActivity(): Promise<AnalyticsEvent[]> {
  const client = requireClient();

  const { data, error } = await client
    .from('audit_events')
    .select('id, event_name, detail, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    name: row.event_name,
    actor: 'Network',
    detail: row.detail,
    createdAt: new Date(row.created_at).toLocaleString(),
  }));
}

export async function getMyNotifications(): Promise<NotificationItem[]> {
  const client = requireClient();
  const user = await getAuthUser();
  if (!user) return [];

  const { data, error } = await client
    .from('notifications')
    .select('id, type, title, body, read, created_at')
    .eq('profile_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    read: row.read,
    createdAt: new Date(row.created_at).toLocaleString(),
  }));
}
