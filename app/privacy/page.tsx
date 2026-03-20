import { Card, Pill } from '@/components/ui';

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6 md:p-8">
      <Card className="gradient-bg border-0">
        <Pill>Privacy</Pill>
        <h1 className="mt-3 text-3xl font-bold text-ink">Privacy policy</h1>
        <p className="mt-2 text-slate-600">Starter privacy page for Meet me alpha testing.</p>
      </Card>
      <Card className="space-y-4">
        <section>
          <h2 className="text-lg font-semibold text-ink">What we collect</h2>
          <p className="mt-2 text-sm text-slate-600">Account details, profile information, community content, chat messages, invite activity, and usage events needed to operate the product.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-ink">Why we use it</h2>
          <p className="mt-2 text-sm text-slate-600">To provide the service, improve recommendations, keep communities safe, and measure product health.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-ink">Alpha note</h2>
          <p className="mt-2 text-sm text-slate-600">Before public launch, this page should be reviewed by legal counsel and updated with final retention, subprocessors, and deletion policy details.</p>
        </section>
      </Card>
    </div>
  );
}
