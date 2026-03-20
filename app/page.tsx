import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button, Card, Pill } from '@/components/ui';

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-6xl p-6 md:p-10">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <Pill className="inline-flex items-center gap-2"><Sparkles size={14} /> Startup-ready social product demo</Pill>
          <h1 className="text-5xl font-bold tracking-tight text-ink md:text-6xl">Meet me is a polished community platform for interest-based groups, text-first feeds, and social momentum.</h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">This repaired version is designed to work immediately. It includes onboarding, discovery, joinable groups, profile editing, post creation, and group chat backed by local persistence.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/signup"><Button>Create account</Button></Link>
            <Link href="/home"><Button className="bg-slate-900">Open product demo</Button></Link>
          </div>
        </div>
        <Card className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Why it feels startup-level</div>
              <div className="mt-2 text-2xl font-semibold text-ink">Clear growth loops</div>
            </div>
            <ArrowRight className="text-brand" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              'Interest onboarding',
              'Joinable public groups',
              'Create-post flow',
              'Community chat',
              'Editable profile',
              'Launch playbook'
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-700">{item}</div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
