'use client';

import { Card } from '@/components/ui';

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

export function FeedbackAnalyticsCharts({
  byCategory,
  byStatus,
  topPages
}: {
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
  topPages: { page: string; count: number }[];
}) {
  const categoryMax = maxValue(Object.values(byCategory));
  const statusMax = maxValue(Object.values(byStatus));
  const pageMax = maxValue(topPages.map((item) => item.count));

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <Card className="space-y-4">
        <div className="text-lg font-semibold text-ink">By category</div>
        <div className="space-y-4">
          {Object.entries(byCategory).map(([label, value]) => (
            <BarRow key={label} label={label} value={value} max={categoryMax} />
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="text-lg font-semibold text-ink">By status</div>
        <div className="space-y-4">
          {Object.entries(byStatus).map(([label, value]) => (
            <BarRow key={label} label={label} value={value} max={statusMax} />
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="text-lg font-semibold text-ink">Top pages</div>
        <div className="space-y-4">
          {topPages.length ? topPages.map((item) => (
            <BarRow key={item.page} label={item.page} value={item.count} max={pageMax} />
          )) : <div className="text-sm text-slate-500">No page hotspots yet.</div>}
        </div>
      </Card>
    </div>
  );
}
