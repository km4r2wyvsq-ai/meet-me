'use client';

import { Bell, CheckCheck } from 'lucide-react';
import { Card, Pill } from '@/components/ui';
import { useStore } from '@/lib/store';

export function NotificationsPanel() {
  const { state, markAllNotificationsRead } = useStore();

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Bell size={18} />
          <div className="text-lg font-semibold text-ink">Notifications</div>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium hover:bg-slate-50" onClick={() => markAllNotificationsRead()}>
          <CheckCheck size={16} />
          Mark all read
        </button>
      </div>
      <div className="space-y-3">
        {state.notifications.length ? state.notifications.map((item) => (
          <div key={item.id} className="rounded-2xl border p-4">
            <div className="mb-1 flex items-center justify-between gap-3">
              <div className="font-medium text-ink">{item.title}</div>
              {!item.read ? <Pill>New</Pill> : null}
            </div>
            <div className="text-sm text-slate-600">{item.body}</div>
            <div className="mt-2 text-xs text-slate-400">{item.createdAt}</div>
          </div>
        )) : <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No notifications yet.</div>}
      </div>
    </Card>
  );
}
