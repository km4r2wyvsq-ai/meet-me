import { supabase, supabaseEnabled } from '@/lib/supabase/client';
import type { Group, Message, NotificationItem, Post, ReportItem, UserProfile, AnalyticsEvent, Comment } from '@/lib/types';

function requireClient() {
  if (!supabaseEnabled || !supabase) throw new Error('Supabase is not enabled.');
  return supabase;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

export async function getAuthUser() {
  const client = requireClient();
  const { data } = await client.auth.getUser();
  return data.user;
}

export async function getSessionProfile(): Promise<UserProfile | null> {
  const client = requireClient();
  const user = await getAuthUser();
  if (!user) return null;

  const { data, error } = await client
    .from('profiles')
    .select('username, display_name, bio, avatar_url, role')
    .eq('id', user.id)
    .maybeSingle();
  if (error) throw error;

  return {
    email: user.email ?? '',
    username: data?.username ?? 'new-user',
    displayName: data?.display_name ?? 'New User',
    bio: data?.bio ?? '',
    avatarUrl: data?.avatar_url ?? '',
    role: data?.role ?? 'member',
    interests: await getUserInterests(user.id)
  };
}

export async function signIn(email: string, password: string) {
  const client = requireClient();
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signUp(email: string, password: string, username: string) {
  const client = requireClient();
  const { data, error } = await client.auth.signUp({ email, password });
  if (error) throw error;
  const user = data.user;
  if (!user) return;

  const { error: profileError } = await client.from('profiles').upsert({
    id: user.id,
    username,
    display_name: username,
    bio: '',
    role: 'member'
  });
  if (profileError) throw profileError;

  await createAuditEvent('signup_completed', `Created account with ${email}.`);
  await createNotification({
    profileId: user.id,
    type: 'system',
    title: 'Welcome to Meet me',
    body: 'Pick your interests and join your first communities.'
  });
}

export async function signOut() {
  const client = requireClient();
  const { error } = await client.auth.signOut();
  if (error) throw error;
}

export async function updateProfile(updates: Partial<UserProfile>) {
  const client = requireClient();
  const user = await getAuthUser();
  if (!user) throw new Error('No signed-in user.');

  const payload: Record<string, string> = {};
  if (updates.username !== undefined) payload.username = updates.username;
  if (updates.displayName !== undefined) payload.display_name = updates.displayName;
  if (updates.bio !== undefined) payload.bio = updates.bio;
  if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl;
  if (updates.role !== undefined) payload.role = updates.role;

  const { error } = await client.from('profiles').update(payload).eq('id', user.id);
  if (error) throw error;
  await createAuditEvent('profile_updated', 'Updated profile fields.');
}

export async function getUserInterests(userId: string): Promise<string[]> {
  const client = requireClient();
  const { data, error } = await client.from('user_interests').select('interests(name)').eq('user_id', userId);
  if (error) throw error;
  return (data ?? []).map((row: any) => row.interests?.name).filter(Boolean);
}

export async function setUserInterests(interests: string[]) {
  const client = requireClient();
  const user = await getAuthUser();
  if (!user) throw new Error('No signed-in user.');
  const { error: deleteError } = await client.from('user_interests').delete().eq('user_id', user.id);
  if (deleteError) throw deleteError;

  if (interests.length) {
    const { data: interestRows, error } = await client.from('interests').select('id,name').in('name', interests);
    if (error) throw error;
    const rows = (interestRows ?? []).map((interest: any) => ({ user_id: user.id, interest_id: interest.id }));
    if (rows.length) {
      const { error: insertError } = await client.from('user_interests').insert(rows);
      if (insertError) throw insertError;
    }
  }
  await createAuditEvent('interests_updated', `Selected ${interests.length} interests.`);
}

export async function getGroups(): Promise<Group[]> {
  const client = requireClient();
  const user = await getAuthUser();
  const currentUserId = user?.id ?? null;

  const { data, error } = await client
    .from('groups')
    .select('id,name,slug,description,category,group_members(profile_id)')
    .order('created_at', { ascending: false });
  if (error) throw error;

  return (data ?? []).map((group: any) => {
    const members = group.group_members ?? [];
    return {
      id: group.id,
      name: group.name,
      slug: group.slug,
      description: group.description,
      category: group.category ?? 'Community',
      memberCount: members.length,
      tags: [group.category ?? 'Community'],
      joined: Boolean(currentUserId && members.some((member: any) => member.profile_id === currentUserId))
    };
  });
}

export async function createGroup(input: { name: string; slug: string; description: string; category: string }) {
  const client = requireClient();
  const user = await getAuthUser();
  if (!user) throw new Error('No signed-in user.');

  const { data, error } = await client
    .from('groups')
    .insert({ name: input.name, slug: input.slug, description: input.description, category: input.category, created_by: user.id })
    .select('id')
    .single();
  if (error) throw error;

  const { error: memberError } = await client.from('group_members').insert({ group_id: data.id, profile_id: user.id, role: 'admin' });
  if (memberError) throw memberError;

  await createNotification({ profileId: user.id, type: 'system', title: 'Group launched', body: `${input.name} is live. Invite the first members and seed it with posts.` });
  await createAuditEvent('group_created', `Created ${input.name}.`);
}

export async function joinGroup(groupId: string, groupName?: string) {
  const client = requireClient();
  const user = await getAuthUser();
  if (!user) throw new Error('No signed-in user.');
  const { error } = await client.from('group_members').insert({ group_id: groupId, profile_id: user.id, role: 'member' });
  if (error) throw error;
  if (groupName) {
    await createNotification({ profileId: user.id, type: 'group', title: `Joined ${groupName}`, body: 'This group now appears in your home feed and activity loop.' });
  }
  await createAuditEvent('group_joined', `Joined ${groupName ?? groupId}.`);
}

export async function leaveGroup(groupId: string, groupName?: string) {
  const client = requireClient();
  const user = await getAuthUser();
  if (!user) throw new Error('No signed-in user.');
  const { error } = await client.from('group_members').delete().eq('group_id', groupId).eq('profile_id', user.id);
  if (error) throw error;
  await createAuditEvent('group_left', `Left ${groupName ?? groupId}.`);
}

export async function getPosts(): Promise<Post[]> {
  const client = requireClient();
  const user = await getAuthUser();
  const currentUserId = user?.id ?? '';

  const { data, error } = await client
    .from('posts')
    .select('id,content,image_url,created_at,group_id,groups(name),profiles(username,display_name),comments(id),likes(profile_id)')
    .order('created_at', { ascending: false });
  if (error) throw error;

  return (data ?? []).map((post: any) => ({
    id: post.id,
    author: post.profiles?.display_name ?? 'Unknown',
    authorUsername: post.profiles?.username ?? 'unknown',
    groupId: post.group_id,
    groupName: post.groups?.name ?? 'Group',
    content: post.content ?? '',
    image: post.image_url ?? undefined,
    likes: (post.likes ?? []).length,
    comments: (post.comments ?? []).length,
    likedByMe: Boolean(currentUserId && (post.likes ?? []).some((like: any) => like.profile_id === currentUserId)),
    createdAt: formatDate(post.created_at),
    trend: 'new'
  }));
}

export async function createPost(input: { groupId: string; groupName?: string; content: string; imageUrl?: string }) {
  const client = requireClient();
  const user = await getAuthUser();
  if (!user) throw new Error('No signed-in user.');
  const { error } = await client.from('posts').insert({
    author_id: user.id,
    group_id: input.groupId,
    content: input.content,
    image_url: input.imageUrl ?? null
  });
  if (error) throw error;

  await createNotification({ profileId: user.id, type: 'system', title: 'Post published', body: `Your post is now live in ${input.groupName ?? 'your group'}.` });
  await createAuditEvent('post_created', `Published into ${input.groupName ?? input.groupId}.`);
}

export async function getComments(): Promise<Comment[]> {
  const client = requireClient();
  const { data, error } = await client
    .from('comments')
    .select('id,post_id,content,created_at,profiles(username,display_name)')
    .order('created_at', { ascending: true });
  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    postId: row.post_id,
    author: row.profiles?.display_name ?? 'Unknown',
    authorUsername: row.profiles?.username ?? 'unknown',
    content: row.content,
    createdAt: formatDate(row.created_at)
  }));
}

export async function createComment(input: { postId: string; content: string }) {
  const client = requireClient();
  const user = await getAuthUser();
  if (!user) throw new Error('No signed-in user.');
  const { error } = await client.from('comments').insert({
    post_id: input.postId,
    author_id: user.id,
    content: input.content
  });
  if (error) throw error;
  await createAuditEvent('comment_created', `Commented on post ${input.postId}.`);
}

export async function toggleLike(postId: string, currentlyLiked: boolean) {
  const client = requireClient();
  const user = await getAuthUser();
  if (!user) throw new Error('No signed-in user.');

  if (currentlyLiked) {
    const { error } = await client.from('likes').delete().eq('post_id', postId).eq('profile_id', user.id);
    if (error) throw error;
    await createAuditEvent('post_unliked', `Removed like from post ${postId}.`);
  } else {
    const { error } = await client.from('likes').insert({ post_id: postId, profile_id: user.id });
    if (error) throw error;
    await createAuditEvent('post_liked', `Liked post ${postId}.`);
  }
}

export async function getMessages(groupId: string): Promise<Message[]> {
  const client = requireClient();
  const { data, error } = await client
    .from('messages')
    .select('id,content,image_url,created_at,group_id,profiles(display_name)')
    .eq('group_id', groupId)
    .order('created_at', { ascending: true });
  if (error) throw error;

  return (data ?? []).map((message: any) => ({
    id: message.id,
    groupId: message.group_id,
    author: message.profiles?.display_name ?? 'Unknown',
    content: message.content ?? '',
    image: message.image_url ?? undefined,
    createdAt: new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }));
}

export async function createMessage(input: { groupId: string; groupName?: string; content: string; imageUrl?: string }) {
  const client = requireClient();
  const user = await getAuthUser();
  if (!user) throw new Error('No signed-in user.');
  const { error } = await client.from('messages').insert({
    author_id: user.id,
    group_id: input.groupId,
    content: input.content,
    image_url: input.imageUrl ?? null
  });
  if (error) throw error;
  await createAuditEvent('message_sent', `Sent a message in ${input.groupName ?? input.groupId}.`);
}

export async function getNotifications(): Promise<NotificationItem[]> {
  const client = requireClient();
  const user = await getAuthUser();
  if (!user) return [];
  const { data, error } = await client
    .from('notifications')
    .select('id,type,title,body,read,created_at')
    .eq('profile_id', user.id)
    .order('created_at', { ascending: false });
  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    read: row.read,
    createdAt: formatDate(row.created_at)
  }));
}

export async function markAllNotificationsRead() {
  const client = requireClient();
  const user = await getAuthUser();
  if (!user) return;
  const { error } = await client.from('notifications').update({ read: true }).eq('profile_id', user.id).eq('read', false);
  if (error) throw error;
  await createAuditEvent('notifications_cleared', 'Marked notifications as read.');
}

export async function createNotification(input: { profileId: string; type: string; title: string; body: string }) {
  const client = requireClient();
  const { error } = await client.from('notifications').insert({
    profile_id: input.profileId,
    type: input.type,
    title: input.title,
    body: input.body
  });
  if (error) throw error;
}

export async function getReports(): Promise<ReportItem[]> {
  const client = requireClient();
  const { data, error } = await client
    .from('reports')
    .select('id,target_type,target_id,reason,status,created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    targetType: row.target_type,
    targetId: row.target_id,
    reason: row.reason,
    status: row.status,
    createdAt: formatDate(row.created_at)
  }));
}

export async function createReport(input: { targetType: ReportItem['targetType']; targetId: string; reason: string }) {
  const client = requireClient();
  const user = await getAuthUser();
  if (!user) throw new Error('No signed-in user.');
  const { error } = await client.from('reports').insert({
    created_by: user.id,
    target_type: input.targetType,
    target_id: input.targetId,
    reason: input.reason
  });
  if (error) throw error;
  await createAuditEvent('report_created', `Opened a ${input.targetType} report.`);
}

export async function resolveReport(reportId: string) {
  const client = requireClient();
  const { error } = await client.from('reports').update({ status: 'resolved' }).eq('id', reportId);
  if (error) throw error;
  await createAuditEvent('report_resolved', `Resolved report ${reportId}.`);
}

export async function getAuditEvents(): Promise<AnalyticsEvent[]> {
  const client = requireClient();
  const user = await getAuthUser();
  if (!user) return [];
  const { data, error } = await client
    .from('audit_events')
    .select('id,event_name,detail,created_at')
    .eq('profile_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    name: row.event_name,
    actor: 'You',
    detail: row.detail,
    createdAt: formatDate(row.created_at)
  }));
}

export async function createAuditEvent(eventName: string, detail: string) {
  const client = requireClient();
  const user = await getAuthUser();
  if (!user) return;
  const { error } = await client.from('audit_events').insert({
    profile_id: user.id,
    event_name: eventName,
    detail
  });
  if (error) throw error;
}
