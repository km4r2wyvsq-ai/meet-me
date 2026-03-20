'use client';

import { useEffect } from 'react';
import { notFound } from 'next/navigation';
import { ChatPanel } from '@/components/chat-panel';
import { Card } from '@/components/ui';
import { ChatPresenceCard } from '@/components/chat-presence-card';
import { useStore } from '@/lib/store';

export function GroupChatPageClient({ slug }: { slug: string }) {
  const { state, loadGroupMessages, attachPresenceToGroup } = useStore();
  const group = state.groups.find((item) => item.slug === slug);
  if (!group) return notFound();

  useEffect(() => {
    loadGroupMessages(group.id);
    const cleanup = attachPresenceToGroup(group.id);
    return cleanup;
  }, [group.id]);

  return (
    <div className="grid gap-6 p-6 md:p-8 xl:grid-cols-[1fr_280px]">
      <ChatPanel groupId={group.id} />
      <div className="space-y-6">
        <ChatPresenceCard groupId={group.id} />
        <Card className="space-y-3">
          <div className="text-lg font-semibold text-ink">{group.name}</div>
          <p className="text-sm text-slate-600">This page now has message loading, presence scaffolding, and app-level typing state for a more live chat feel.</p>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">Next production step: move typing and online state fully into Supabase Realtime Presence for multi-user chat.</div>
        </Card>
      </div>
    </div>
  );
}
