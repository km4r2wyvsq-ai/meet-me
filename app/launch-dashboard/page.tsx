'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Card, Pill } from '@/components/ui';
import { useStore } from '@/lib/store';

export default function LaunchDashboardPage() {
  const { state, analytics } = useStore();

  const kpis = useMemo(() => {
    const followingCount = state.follows.filter((item) => item.followerUsername === state.profile.username).length;
    const inviteAcceptanceRate = state.invites.length
      ? Math.round(
          (state.invites.reduce((sum, item) => sum + item.acceptedCount, 0) /
            Math.max(1, state.invites.length)) * 100
        ) / 100
      : 0;

    const firstWeekActivation = Math.min(
      100,
      analytics.profileCompletion * 0.35 +
      analytics.joinedGroups * 15 +
      analytics.postsCreated * 20 +
      analytics.messagesSent * 10
    );

    return {
      joinedGroups: analytics.joinedGroups,
      postsCreated: analytics.postsCreated,
      messagesSent: analytics.messagesSent,
      followingCount,
      inviteAcceptanceRate,
      firstWeekActivation
    };
  }, [state, analytics]);

  const readinessChecks = [
    { label: 'Core feed interactions', done: true },
    { label: 'Group chat and presence scaffolding', done: true },
    { label: 'Invites and acceptance flow', done: true },
    { label: 'Follow graph and public profiles', done: true },
    { label: 'Creator analytics backend path', done: true },
    { label: 'Automated metric rollups', done: true },
    { label: 'Push / email notifications', done: false },
    { label: 'Health endpoint and deployment guide', done: true },
    { label: 'Legal pages', done: true },
    { label: 'Monitoring plan', done: true },
    { label: 'QA across all key flows', done: false },
    { label: 'Sentry and alerting credentials configured', done: false },
    { label: 'Production deployment hardening', done: false }
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 md:p-8">
      <Card className="gradient-bg border-0">
        <div className="flex flex-wrap items-center gap-3">
          <Pill>Launch dashboard</Pill>
          <Pill>{state.networkMode}</Pill>
        </div>
        <h1 className="mt-3 text-3xl font-bold text-ink">Meet me launch readiness</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          This page summarizes the current product state, growth health signals, and the remaining launch blockers.
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <div className="text-sm text-slate-500">Joined groups</div>
          <div className="mt-2 text-3xl font-bold text-ink">{kpis.joinedGroups}</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Posts created</div>
          <div className="mt-2 text-3xl font-bold text-ink">{kpis.postsCreated}</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Messages sent</div>
          <div className="mt-2 text-3xl font-bold text-ink">{kpis.messagesSent}</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Following</div>
          <div className="mt-2 text-3xl font-bold text-ink">{kpis.followingCount}</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Avg invite accepts / link</div>
          <div className="mt-2 text-3xl font-bold text-ink">{kpis.inviteAcceptanceRate}</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Activation score</div>
          <div className="mt-2 text-3xl font-bold text-ink">{Math.round(kpis.firstWeekActivation)}%</div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <Card className="space-y-4">
          <div className="text-lg font-semibold text-ink">Launch checklist</div>
          <div className="space-y-3">
            {readinessChecks.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl border p-4">
                <div className="text-sm text-slate-700">{item.label}</div>
                <span className={item.done ? 'rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700' : 'rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'}>
                  {item.done ? 'Done' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="text-lg font-semibold text-ink">High-priority next actions</div>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 p-4">Finish QA on auth, groups, feed, chat, profile, invites, activity, and dashboards.</div>
            <div className="rounded-2xl bg-slate-50 p-4">Add push or email notification delivery.</div>
            <div className="rounded-2xl bg-slate-50 p-4">Deploy the production environment and run smoke tests.</div>
          </div>
          <div className="pt-2">
            <Link href="/creator" className="text-sm font-semibold text-brand">Open creator analytics →</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
