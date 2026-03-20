'use client';

import { Card, Pill } from '@/components/ui';

const demoUsers = [
  { name: 'Founder Admin', role: 'admin', stage: 'seeded', note: 'Creates starter groups and posts' },
  { name: 'Creator Tester 1', role: 'member', stage: 'invited', note: 'Focus on posting and invites' },
  { name: 'Creator Tester 2', role: 'member', stage: 'active', note: 'Focus on creator analytics and retention' },
  { name: 'Community Tester 1', role: 'member', stage: 'active', note: 'Focus on join, chat, and feedback' },
  { name: 'Community Tester 2', role: 'member', stage: 'queued', note: 'Ready for next invite batch' }
];

export default function AlphaUsersPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 md:p-8">
      <Card className="gradient-bg border-0">
        <Pill>Alpha user ops</Pill>
        <h1 className="mt-3 text-3xl font-bold text-ink">Tester batches</h1>
        <p className="mt-2 text-slate-600">Track who is seeded, invited, active, or queued for the next closed alpha batch.</p>
      </Card>

      <div className="space-y-4">
        {demoUsers.map((user) => (
          <Card key={user.name}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-ink">{user.name}</div>
                <div className="mt-1 text-sm text-slate-500">{user.note}</div>
              </div>
              <div className="flex gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{user.role}</span>
                <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">{user.stage}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
