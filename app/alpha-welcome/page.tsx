import { Card, Pill } from '@/components/ui';

export default function AlphaWelcomePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6 md:p-8">
      <Card className="gradient-bg border-0">
        <Pill>Closed alpha</Pill>
        <h1 className="mt-3 text-3xl font-bold text-ink">Welcome to Meet me alpha</h1>
        <p className="mt-2 text-slate-600">
          Thanks for testing Meet me. This is an early version focused on groups, posts, chat, invites, and feedback.
        </p>
      </Card>

      <Card className="space-y-4">
        <div className="text-lg font-semibold text-ink">What to do first</div>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-600">
          <li>Create your account and complete your profile.</li>
          <li>Pick interests and join at least one group.</li>
          <li>Create one post or send one chat message.</li>
          <li>Try an invite flow and submit one piece of feedback.</li>
        </ol>
      </Card>

      <Card className="space-y-4">
        <div className="text-lg font-semibold text-ink">What we want feedback on</div>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>What feels intuitive vs confusing</li>
          <li>Where the app feels empty or unclear</li>
          <li>Whether invites and groups feel useful</li>
          <li>Any bugs, broken flows, or slow pages</li>
        </ul>
      </Card>
    </div>
  );
}
