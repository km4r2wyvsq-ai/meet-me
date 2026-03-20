'use client';

import { useEffect, useState } from 'react';
import { Card, Pill } from '@/components/ui';
import { supabaseEnabled } from '@/lib/supabase/client';
import { getCreatorMetrics, type CreatorMetricRow } from '@/lib/supabase/creator-analytics';
import { CreatorCharts } from '@/components/creator-charts';

export default function CreatorPage() {
  const [rows, setRows] = useState<CreatorMetricRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function run() {
      if (!supabaseEnabled) return;
      setLoading(true);
      try {
        setRows(await getCreatorMetrics());
      } finally {
        setLoading(false);
      }
    }
    run();
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 md:p-8">
      <Card className="gradient-bg border-0">
        <Pill>Creator analytics</Pill>
        <h1 className="mt-3 text-3xl font-bold text-ink">Group growth analytics</h1>
        <p className="mt-2 text-slate-600">Track invite creation, invite acceptance, post output, and engagement by group.</p>
      </Card>

      {!supabaseEnabled ? (
        <Card>
          <div className="text-sm text-slate-500">Enable Supabase mode to load creator analytics.</div>
        </Card>
      ) : loading ? (
        <Card>
          <div className="text-sm text-slate-500">Loading analytics…</div>
        </Card>
      ) : (
        <>
          <CreatorCharts rows={rows} />
          <div className="space-y-4">
            {rows.length ? rows.map((row) => (
              <Card key={`${row.groupId}-${row.metricDate}`}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold text-ink">{row.groupName}</div>
                    <div className="mt-1 text-sm text-slate-500">{row.metricDate}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center">
                      <div className="text-xl font-bold text-ink">{row.invitesCreated}</div>
                      <div className="text-xs text-slate-500">Invites</div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center">
                      <div className="text-xl font-bold text-ink">{row.invitesAccepted}</div>
                      <div className="text-xs text-slate-500">Accepted</div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center">
                      <div className="text-xl font-bold text-ink">{row.postsCreated}</div>
                      <div className="text-xs text-slate-500">Posts</div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center">
                      <div className="text-xl font-bold text-ink">{row.commentsReceived}</div>
                      <div className="text-xs text-slate-500">Comments</div>
                    </div>
                  </div>
                </div>
              </Card>
            )) : (
              <Card>
                <div className="text-sm text-slate-500">No creator metrics yet.</div>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}
