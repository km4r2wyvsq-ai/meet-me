'use client';

import { Flag } from 'lucide-react';
import { Card } from '@/components/ui';
import { useStore } from '@/lib/store';

export function ReportCard() {
  const { state, createReport, resolveReport } = useStore();

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2">
        <Flag size={18} />
        <div className="text-lg font-semibold text-ink">Moderation queue</div>
      </div>
      <div className="rounded-2xl bg-slate-50 p-4">
        <div className="mb-3 text-sm text-slate-600">Demo or live action: create a report to validate moderation flow.</div>
        <button
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          onClick={() => createReport({ targetType: 'post', targetId: 'demo-post', reason: 'Spam or off-topic content' })}
        >
          Create report
        </button>
      </div>
      <div className="space-y-3">
        {state.reports.length ? state.reports.map((item) => (
          <div key={item.id} className="rounded-2xl border p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="font-medium text-ink">{item.targetType} · {item.reason}</div>
              <button className="rounded-xl border px-3 py-2 text-sm font-medium hover:bg-slate-50" onClick={() => resolveReport(item.id)}>
                {item.status === 'resolved' ? 'Resolved' : 'Resolve'}
              </button>
            </div>
            <div className="mt-1 text-sm text-slate-600">Target: {item.targetId}</div>
            <div className="mt-1 text-xs text-slate-400">{item.status} · {item.createdAt}</div>
          </div>
        )) : <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No open reports yet.</div>}
      </div>
    </Card>
  );
}
