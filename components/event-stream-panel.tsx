'use client';

import { Activity } from 'lucide-react';
import { Card } from '@/components/ui';
import { useStore } from '@/lib/store';

export function EventStreamPanel() {
  const { state } = useStore();

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2">
        <Activity size={18} />
        <div className="text-lg font-semibold text-ink">Event stream</div>
      </div>
      <div className="space-y-3">
        {state.analyticsEvents.length ? state.analyticsEvents.map((event) => (
          <div key={event.id} className="rounded-2xl border p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="font-medium text-ink">{event.name}</div>
              <div className="text-xs text-slate-400">{event.createdAt}</div>
            </div>
            <div className="mt-1 text-sm text-slate-600">{event.actor}</div>
            <div className="mt-1 text-sm text-slate-500">{event.detail}</div>
          </div>
        )) : <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No events logged yet.</div>}
      </div>
    </Card>
  );
}
