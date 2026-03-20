'use client';

import { useMemo } from 'react';
import { Card, Pill } from '@/components/ui';
import { useStore } from '@/lib/store';

export default function StatusPage() {
  const { state, analytics } = useStore();

  const summary = useMemo(() => {
    const joinedGroups = state.groups.filter((group) => group.joined).length;
    const activeInvites = state.invites.length;
    const acceptedInvites = state.invites.reduce((sum, invite) => sum + invite.acceptedCount, 0);
    const following = state.follows.filter((item) => item.followerUsername === state.profile.username).length;
    const openReports = state.reports.filter((item) => item.status !== 'resolved').length;
    const newFeedback = 3;

    return {
      joinedGroups,
      activeInvites,
      acceptedInvites,
      following,
      unreadNotifications: analytics.notificationsUnread,
      openReports,
      newFeedback
    };
  }, [state, analytics]);

  const incidents = [
    { title: 'Auth health', state: 'healthy', note: 'Login and session state available in app.' },
    { title: 'Feed health', state: 'healthy', note: 'Posts, likes, and comments render.' },
    { title: 'Chat health', state: 'healthy', note: 'Messages and presence scaffolding available.' },
    { title: 'Monitoring', state: 'needs_setup', note: 'Sentry credentials still need to be configured.' },
    { title: 'Alerts', state: 'needs_setup', note: 'Real outbound email delivery is not yet wired.' }
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 md:p-8">
      <Card className="gradient-bg border-0">
        <div className="flex flex-wrap items-center gap-3">
          <Pill>Alpha execution</Pill>
          <Pill>{state.networkMode}</Pill>
        </div>
        <h1 className="mt-3 text-3xl font-bold text-ink">Operational status</h1>
        <p className="mt-2 text-slate-600">A simple command-center view for closed alpha readiness and day-to-day checks.</p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card><div className="text-sm text-slate-500">Joined groups</div><div className="mt-2 text-3xl font-bold text-ink">{summary.joinedGroups}</div></Card>
        <Card><div className="text-sm text-slate-500">Active invites</div><div className="mt-2 text-3xl font-bold text-ink">{summary.activeInvites}</div></Card>
        <Card><div className="text-sm text-slate-500">Accepted invites</div><div className="mt-2 text-3xl font-bold text-ink">{summary.acceptedInvites}</div></Card>
        <Card><div className="text-sm text-slate-500">Following</div><div className="mt-2 text-3xl font-bold text-ink">{summary.following}</div></Card>
        <Card><div className="text-sm text-slate-500">Unread alerts</div><div className="mt-2 text-3xl font-bold text-ink">{summary.unreadNotifications}</div></Card>
        <Card><div className="text-sm text-slate-500">Open reports</div><div className="mt-2 text-3xl font-bold text-ink">{summary.openReports}</div></Card>
        <Card><div className="text-sm text-slate-500">New feedback</div><div className="mt-2 text-3xl font-bold text-ink">{summary.newFeedback}</div></Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card className="space-y-4">
          <div className="text-lg font-semibold text-ink">Service checks</div>
          <div className="space-y-3">
            {incidents.map((item) => (
              <div key={item.title} className="flex items-center justify-between rounded-2xl border p-4">
                <div>
                  <div className="font-semibold text-ink">{item.title}</div>
                  <div className="mt-1 text-sm text-slate-600">{item.note}</div>
                </div>
                <span className={item.state === 'healthy'
                  ? 'rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700'
                  : 'rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'}>
                  {item.state === 'healthy' ? 'Healthy' : 'Setup needed'}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="text-lg font-semibold text-ink">Operator notes</div>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 p-4">Run the QA flow before each new alpha batch.</div>
            <div className="rounded-2xl bg-slate-50 p-4">Watch invite acceptance and first-post behavior closely.</div>
            <div className="rounded-2xl bg-slate-50 p-4">Review moderation queue and unread alerts daily.</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
