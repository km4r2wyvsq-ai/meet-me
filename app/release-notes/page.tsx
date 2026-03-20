import { Card, Pill } from '@/components/ui';

const notes = [
  {
    version: 'Alpha build',
    bullets: [
      'Groups, feed, chat, search, follows, invites, activity, creator analytics, and launch tooling are present.',
      'Closed alpha operator tooling now includes status, QA, launch dashboard, and release operations.',
      'Production scaffolding includes health checks, deployment docs, Sentry path, CI, and test alert endpoints.'
    ]
  }
];

export default function ReleaseNotesPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6 md:p-8">
      <Card className="gradient-bg border-0">
        <Pill>Release notes</Pill>
        <h1 className="mt-3 text-3xl font-bold text-ink">What changed in Meet me</h1>
        <p className="mt-2 text-slate-600">A lightweight release log for testers and internal operators.</p>
      </Card>

      {notes.map((note) => (
        <Card key={note.version} className="space-y-4">
          <div className="text-lg font-semibold text-ink">{note.version}</div>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
            {note.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
          </ul>
        </Card>
      ))}
    </div>
  );
}
