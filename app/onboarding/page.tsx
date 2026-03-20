'use client';

import Link from 'next/link';
import { Button, Card, Pill } from '@/components/ui';
import { useStore } from '@/lib/store';

const options = ['Photography', 'Travel', 'Startups', 'Food', 'Books', 'Fitness', 'Design', 'Careers'];

export default function OnboardingPage() {
  const { state, toggleInterest } = useStore();

  return (
    <div className="mx-auto max-w-3xl p-6 md:p-10">
      <Card className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-ink">Pick your interests</h1>
          <p className="mt-2 text-slate-500">These power your discovery feed, group suggestions, and onboarding momentum.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {options.map((interest) => {
            const active = state.profile.interests.includes(interest);
            return (
              <button key={interest} onClick={() => toggleInterest(interest)}>
                <Pill className={active ? 'ring-4 ring-brand/15' : 'bg-slate-100 text-slate-700'}>{interest}</Pill>
              </button>
            );
          })}
        </div>
        <div className="flex justify-end">
          <Link href="/home"><Button>Finish onboarding</Button></Link>
        </div>
      </Card>
    </div>
  );
}
