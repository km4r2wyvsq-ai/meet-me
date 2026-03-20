'use client';

import { useMemo } from 'react';
import { Card } from '@/components/ui';
import type { CreatorMetricRow } from '@/lib/supabase/creator-analytics';

function maxValue(values: number[]) {
  return Math.max(1, ...values);
}

function BarRow({ label, value, max }: { label: string; value: number; max: number }) {
  const width = `${Math.max(6, Math.round((value / max) * 100))}%`;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-ink">{value}</span>
      </div>
      <div className="h-3 rounded-full bg-slate-100">
        <div className="h-3 rounded-full bg-brand" style={{ width }} />
      </div>
    </div>
  );
}

export function CreatorCharts({ rows }: { rows: CreatorMetricRow[] }) {
  const totals = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        acc.invitesCreated += row.invitesCreated;
        acc.invitesAccepted += row.invitesAccepted;
        acc.postsCreated += row.postsCreated;
        acc.commentsReceived += row.commentsReceived;
        return acc;
      },
      { invitesCreated: 0, invitesAccepted: 0, postsCreated: 0, commentsReceived: 0 }
    );
  }, [rows]);

  const funnel = [
    { label: 'Invites created', value: totals.invitesCreated },
    { label: 'Invites accepted', value: totals.invitesAccepted },
    { label: 'Posts created', value: totals.postsCreated },
    { label: 'Comments received', value: totals.commentsReceived }
  ];

  const maxFunnel = maxValue(funnel.map((item) => item.value));

  const byGroup = useMemo(() => {
    const map = new Map<string, { name: string; value: number }>();
    for (const row of rows) {
      const current = map.get(row.groupId) ?? { name: row.groupName, value: 0 };
      current.value += row.invitesAccepted + row.postsCreated + row.commentsReceived;
      map.set(row.groupId, current);
    }
    return Array.from(map.values()).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [rows]);

  const maxGroup = maxValue(byGroup.map((item) => item.value));

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card className="space-y-4">
        <div className="text-lg font-semibold text-ink">Growth funnel</div>
        <div className="space-y-4">
          {funnel.map((item) => (
            <BarRow key={item.label} label={item.label} value={item.value} max={maxFunnel} />
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="text-lg font-semibold text-ink">Top-performing groups</div>
        <div className="space-y-4">
          {byGroup.length ? byGroup.map((item) => (
            <BarRow key={item.name} label={item.name} value={item.value} max={maxGroup} />
          )) : (
            <div className="text-sm text-slate-500">No group activity yet.</div>
          )}
        </div>
      </Card>
    </div>
  );
}
