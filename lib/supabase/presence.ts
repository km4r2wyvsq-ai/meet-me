import { supabase, supabaseEnabled } from '@/lib/supabase/client';

export function createPresenceChannel(
  groupId: string,
  username: string,
  onPresenceSync: (onlineCount: number) => void
) {
  if (!supabaseEnabled || !supabase) {
    return () => {};
  }

  const channel = supabase.channel(`presence:${groupId}`, {
    config: {
      presence: {
        key: username,
      },
    },
  });

  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const onlineCount = Object.keys(state).length;
      onPresenceSync(onlineCount);
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          username,
          online_at: new Date().toISOString(),
        });
      }
    });

  return () => {
    void supabase.removeChannel(channel);
  };
}
