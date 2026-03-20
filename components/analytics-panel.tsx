'use client';

import { BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui';
import { useStore } from '@/lib/store';

export function AnalyticsPanel() {
  const { analytics } = useStore();

  const cards = [
    ['Joined groups', analytics.joinedGroups],
    ['Posts created', analytics.postsCreated],
    ['Messages sent', analytics.messagesSent],
    ['Profile completion', `${analytics.profileCompletion}%`],
    ['Unread notifications', analytics.notificationsUnread]
  ];

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 size={18} />
        <div className="text-lg font-semibold text-ink">Founder metrics</div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm text-slate-500">{label}</div>
            <div className="mt-2 text-2xl font-bold text-ink">{value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
