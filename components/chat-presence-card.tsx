'use client';

import { Activity } from 'lucide-react';
import { Card } from '@/components/ui';
import { useStore } from '@/lib/store';

export function ChatPresenceCard({ groupId }: { groupId: string }) {
  const { state } = useStore();
  const presence = state.presenceByGroup[groupId] || { onlineCount: 0, typingNames: [] };

  return (
    <Card className="space-y-3">
      <div className="flex items-center gap-2">
        <Activity size={18} />
        <div className="text-lg font-semibold text-ink">Live presence</div>
      </div>
      <div className="text-sm text-slate-600">{presence.onlineCount} people online right now</div>
      <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
        {presence.typingNames.length
          ? `${presence.typingNames.join(', ')} ${presence.typingNames.length === 1 ? 'is' : 'are'} typing...`
          : 'Nobody is typing right now.'}
      </div>
    </Card>
  );
}
