'use client';

import { Card, Pill } from '@/components/ui';
import { useStore } from '@/lib/store';
import { buildActivityFeed } from '@/lib/activity-feed';

export default function ActivityPage() {
  const { state } = useStore();
  const items = buildActivityFeed(state.analyticsEvents, state.notifications);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6 md:p-8">
      <Card className="gradient-bg border-0">
        <Pill>Network activity</Pill>
        <h1 className="mt-3 text-3xl font-bold text-ink">Activity feed</h1>
        <p className="mt-2 text-slate-600">A combined stream of your notifications and network events.</p>
      </Card>

      <div className="space-y-4">
        {items.length ? items.map((item) => (
          <Card key={item.id}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-ink">{item.title}</div>
                <div className="mt-1 text-sm text-slate-600">{item.body}</div>
              </div>
              <div className="text-xs text-slate-400">{item.createdAt}</div>
            </div>
          </Card>
        )) : (
          <Card>
            <div className="text-sm text-slate-500">No activity yet.</div>
          </Card>
        )}
      </div>
    </div>
  );
}
