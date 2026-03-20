'use client';

import { Card, Pill } from '@/components/ui';

const items = [
  ['Environment variables', 'Review `.env.example` and production template.'],
  ['Sentry', 'Install package and verify error capture in production.'],
  ['Email alerts', 'Configure Resend and run `/api/admin/test-alert`.'],
  ['Health checks', 'Verify `/api/health` and `/api/health/deep`.'],
  ['Smoke test', 'Run `/api/admin/smoke-test` and browser checklist.'],
  ['Deployment', 'Deploy Vercel or Docker build and verify logs.']
];

export default function ReleaseOpsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 md:p-8">
      <Card className="gradient-bg border-0">
        <div className="flex flex-wrap items-center gap-3">
          <Pill>Release ops</Pill>
          <Pill>Production kit</Pill>
        </div>
        <h1 className="mt-3 text-3xl font-bold text-ink">Production release operations</h1>
        <p className="mt-2 text-slate-600">Use this page as a final preflight checklist before closed alpha deployment.</p>
      </Card>

      <div className="space-y-4">
        {items.map(([title, body]) => (
          <Card key={title}>
            <div className="font-semibold text-ink">{title}</div>
            <div className="mt-2 text-sm text-slate-600">{body}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
