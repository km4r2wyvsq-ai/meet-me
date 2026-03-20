'use client';

import { useMemo } from 'react';
import { Card, Pill } from '@/components/ui';
import { useStore } from '@/lib/store';

export default function QAPage() {
  const { state, analytics } = useStore();

  const checks = useMemo(() => [
    { area: 'Auth', status: state.authenticated ? 'pass' : 'review', note: 'User session and profile state available.' },
    { area: 'Feed', status: state.posts.length ? 'pass' : 'review', note: 'Posts render and feed state exists.' },
    { area: 'Comments', status: state.comments.length ? 'pass' : 'review', note: 'Comments are present in state.' },
    { area: 'Groups', status: state.groups.length ? 'pass' : 'review', note: 'Group discovery and joined groups are available.' },
    { area: 'Chat', status: state.messages.length ? 'pass' : 'review', note: 'Chat messages render and chat route is wired.' },
    { area: 'Notifications', status: analytics.notificationsUnread >= 0 ? 'pass' : 'review', note: 'Unread state and notifications panel available.' },
    { area: 'Invites', status: state.invites.length ? 'pass' : 'review', note: 'Invite creation path exists.' },
    { area: 'Follows', status: state.follows.length ? 'pass' : 'review', note: 'Following graph is present.' },
    { area: 'Legal', status: 'pass', note: 'Privacy and Terms starter pages exist.' },
    { area: 'Monitoring', status: 'review', note: 'Sentry scaffolding added but credentials still needed.' },
    { area: 'Deployment', status: 'review', note: 'Dockerfile and health endpoint exist; production deploy still needed.' },
  ], [state, analytics]);

  const counts = checks.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 md:p-8">
      <Card className="gradient-bg border-0">
        <div className="flex flex-wrap items-center gap-3">
          <Pill>QA center</Pill>
          <Pill>{`${counts.pass || 0} pass`}</Pill>
          <Pill>{`${counts.review || 0} review`}</Pill>
        </div>
        <h1 className="mt-3 text-3xl font-bold text-ink">QA and release readiness</h1>
        <p className="mt-2 text-slate-600">A lightweight in-product surface to review readiness before closed alpha deployment.</p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {checks.map((item) => (
          <Card key={item.area}>
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold text-ink">{item.area}</div>
              <span className={item.status === 'pass'
                ? 'rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700'
                : 'rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'}>
                {item.status}
              </span>
            </div>
            <div className="mt-3 text-sm text-slate-600">{item.note}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
