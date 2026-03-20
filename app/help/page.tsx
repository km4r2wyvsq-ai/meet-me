import { Card, Pill } from '@/components/ui';

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6 md:p-8">
      <Card className="gradient-bg border-0">
        <Pill>Help</Pill>
        <h1 className="mt-3 text-3xl font-bold text-ink">Support and help</h1>
        <p className="mt-2 text-slate-600">Starter support page for alpha participants.</p>
      </Card>
      <Card className="space-y-4">
        <section>
          <h2 className="text-lg font-semibold text-ink">Report a problem</h2>
          <p className="mt-2 text-sm text-slate-600">Use in-app moderation and report flows for content issues. For product bugs, contact the alpha team directly.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-ink">Alpha expectation</h2>
          <p className="mt-2 text-sm text-slate-600">Features may change quickly during alpha. Expect fixes, iteration, and feedback collection.</p>
        </section>
      </Card>
    </div>
  );
}
