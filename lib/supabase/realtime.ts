import { supabase, supabaseEnabled } from '@/lib/supabase/client';

function noop() {
  return () => {};
}

export function subscribeToMessages(groupId: string, onChange: () => void) {
  if (!supabaseEnabled || !supabase) return noop();

  const client = supabase;
  const channel = client
    .channel(`messages:${groupId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `group_id=eq.${groupId}`,
      },
      onChange
    )
    .subscribe();

  return () => {
    void client.removeChannel(channel);
  };
}

export function subscribeToFeed(onChange: () => void) {
  if (!supabaseEnabled || !supabase) return noop();

  const client = supabase;
  const channel = client
    .channel('feed')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'posts',
      },
      onChange
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'comments',
      },
      onChange
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'likes',
      },
      onChange
    )
    .subscribe();

  return () => {
    void client.removeChannel(channel);
  };
}

export function subscribeToReports(onChange: () => void) {
  if (!supabaseEnabled || !supabase) return noop();

  const client = supabase;
  const channel = client
    .channel('reports')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'reports',
      },
      onChange
    )
    .subscribe();

  return () => {
    void client.removeChannel(channel);
  };
}
