'use client';

import { useEffect, useState } from 'react';
import { Card, Pill } from '@/components/ui';
import { supabaseEnabled } from '@/lib/supabase/client';
import { getOnboardingEvents, type OnboardingEventRow } from '@/lib/supabase/beta-readiness';

const demoRows: OnboardingEventRow[] = [
  { id: 'o1', email: 'tester@example.com', eventName: 'account_created', eventDetail: 'Signed up successfully', createdAt: 'Today' },
  { id: 'o2', email: 'tester@example.com', eventName: 'joined_group', eventDetail: 'Joined Build in Public', createdAt: 'Today' },
  { id: 'o3', email: 'tester@example.com', eventName: 'first_post', eventDetail: 'Published first post', createdAt: 'Today' }
];

export default function OnboardingMetricsPage() {
  const [rows, setRows] = useState<OnboardingEventRow[]>(demoRows);

  useEffect(() => {
    async function load() {
      if (!supabaseEnabled) return;
      setRows(await getOnboardingEvents());
    }
    load();
  }, []);

  const counts = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.eventName] = (acc[row.eventName] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 md:p-8">
      <Card className="gradient-bg border-0">
        <Pill>Onboarding metrics</Pill>
        <h1 className="mt-3 text-3xl font-bold text-ink">Early onboarding signals</h1>
        <p className="mt-2 text-slate-600">Review how invited users are progressing through the first-session journey.</p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><div className="text-sm text-slate-500">Accounts created</div><div className="mt-2 text-3xl font-bold text-ink">{counts.account_created || 0}</div></Card>
        <Card><div className="text-sm text-slate-500">Joined group</div><div className="mt-2 text-3xl font-bold text-ink">{counts.joined_group || 0}</div></Card>
        <Card><div className="text-sm text-slate-500">First post</div><div className="mt-2 text-3xl font-bold text-ink">{counts.first_post || 0}</div></Card>
      </div>

      <Card className="space-y-4">
        <div className="text-lg font-semibold text-ink">Recent onboarding events</div>
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.id} className="rounded-2xl border p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold text-ink">{row.eventName}</div>
                <div className="text-xs text-slate-400">{row.createdAt}</div>
              </div>
              <div className="mt-1 text-sm text-slate-500">{row.email}</div>
              <div className="mt-2 text-sm text-slate-700">{row.eventDetail}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
