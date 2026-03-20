import { supabase, supabaseEnabled } from '@/lib/supabase/client';

export function subscribeToMessages(groupId: string, onInsert: () => void) {
  if (!supabaseEnabled || !supabase) return () => {};
  const channel = supabase
    .channel(`messages:${groupId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `group_id=eq.${groupId}` },
      () => onInsert()
    )
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}

export function subscribeToFeed(onChange: () => void) {
  if (!supabaseEnabled || !supabase) return () => {};
  const channel = supabase
    .channel('feed')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => onChange())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, () => onChange())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'likes' }, () => onChange())
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}

export function subscribeToNotifications(profileId: string, onChange: () => void) {
  if (!supabaseEnabled || !supabase || !profileId) return () => {};
  const channel = supabase
    .channel(`notifications:${profileId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'notifications', filter: `profile_id=eq.${profileId}` },
      () => onChange()
    )
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}

export function subscribeToReports(onChange: () => void) {
  if (!supabaseEnabled || !supabase) return () => {};
  const channel = supabase
    .channel('reports')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => onChange())
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}
