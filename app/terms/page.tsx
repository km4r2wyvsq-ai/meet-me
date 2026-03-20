import { Card, Pill } from '@/components/ui';

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6 md:p-8">
      <Card className="gradient-bg border-0">
        <Pill>Terms</Pill>
        <h1 className="mt-3 text-3xl font-bold text-ink">Terms of service</h1>
        <p className="mt-2 text-slate-600">Starter terms page for Meet me alpha testing.</p>
      </Card>
      <Card className="space-y-4">
        <section>
          <h2 className="text-lg font-semibold text-ink">Community rules</h2>
          <p className="mt-2 text-sm text-slate-600">Users must follow community rules, avoid abuse and spam, and respect moderation decisions.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-ink">Accounts and access</h2>
          <p className="mt-2 text-sm text-slate-600">Accounts may be limited or removed for policy violations, fraud, or security concerns.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-ink">Alpha note</h2>
          <p className="mt-2 text-sm text-slate-600">These terms should be finalized before launch with company details, governing law, and support channels.</p>
        </section>
      </Card>
    </div>
  );
}
