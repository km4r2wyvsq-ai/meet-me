'use client';

import { useEffect, useState } from 'react';
import { Card, Pill } from '@/components/ui';
import { supabaseEnabled } from '@/lib/supabase/client';
import { getFeedbackSummary } from '@/lib/supabase/feedback';
import { FeedbackAnalyticsCharts } from '@/components/feedback-analytics-charts';

type Summary = {
  total: number;
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
  topPages: { page: string; count: number }[];
};

const demoSummary: Summary = {
  total: 14,
  byCategory: { bug: 4, idea: 3, ux: 5, performance: 1, other: 1 },
  byStatus: { new: 5, reviewed: 4, planned: 3, closed: 2 },
  topPages: [
    { page: '/home', count: 5 },
    { page: '/creator', count: 3 },
    { page: '/groups/build-in-public/chat', count: 3 },
    { page: '/launch-dashboard', count: 2 }
  ]
};

export default function AdminFeedbackAnalyticsPage() {
  const [summary, setSummary] = useState<Summary>(demoSummary);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!supabaseEnabled) return;
      setLoading(true);
      try {
        setSummary(await getFeedbackSummary());
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 md:p-8">
      <Card className="gradient-bg border-0">
        <Pill>Feedback analytics</Pill>
        <h1 className="mt-3 text-3xl font-bold text-ink">Feedback insights</h1>
        <p className="mt-2 text-slate-600">Track feedback volume, status mix, and page-level hotspots across alpha.</p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card><div className="text-sm text-slate-500">Total items</div><div className="mt-2 text-3xl font-bold text-ink">{summary.total}</div></Card>
        <Card><div className="text-sm text-slate-500">New</div><div className="mt-2 text-3xl font-bold text-ink">{summary.byStatus.new || 0}</div></Card>
        <Card><div className="text-sm text-slate-500">Planned</div><div className="mt-2 text-3xl font-bold text-ink">{summary.byStatus.planned || 0}</div></Card>
        <Card><div className="text-sm text-slate-500">Closed</div><div className="mt-2 text-3xl font-bold text-ink">{summary.byStatus.closed || 0}</div></Card>
      </div>

      {loading ? (
        <Card><div className="text-sm text-slate-500">Loading analytics…</div></Card>
      ) : (
        <FeedbackAnalyticsCharts
          byCategory={summary.byCategory}
          byStatus={summary.byStatus}
          topPages={summary.topPages}
        />
      )}
    </div>
  );
}
