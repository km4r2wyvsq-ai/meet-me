import { Card, Pill } from '@/components/ui';

const phases = [
  {
    title: 'Batch 1',
    detail: '5 to 10 testers. Validate auth, joining groups, posting, chat, invites, and feedback.'
  },
  {
    title: 'Batch 2',
    detail: '15 to 25 testers. Validate activity patterns, invite conversion, moderation load, and retention.'
  },
  {
    title: 'Batch 3',
    detail: '25 to 50 testers. Validate stability, creator behavior, and launch dashboard usefulness.'
  }
];

export default function AlphaPlanPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 md:p-8">
      <Card className="gradient-bg border-0">
        <Pill>Alpha rollout</Pill>
        <h1 className="mt-3 text-3xl font-bold text-ink">Closed alpha rollout plan</h1>
        <p className="mt-2 text-slate-600">Use staged tester batches instead of a broad release.</p>
      </Card>

      <div className="space-y-4">
        {phases.map((phase) => (
          <Card key={phase.title}>
            <div className="font-semibold text-ink">{phase.title}</div>
            <div className="mt-2 text-sm text-slate-600">{phase.detail}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
