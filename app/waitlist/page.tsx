'use client';

import { useState } from 'react';
import { Card, Pill } from '@/components/ui';
import { captureClientError } from '@/lib/monitoring';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [context, setContext] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function submit() {
    setStatus('sending');
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, context }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit waitlist request');
      }

      setStatus('done');
      setEmail('');
      setName('');
      setContext('');
    } catch (error) {
      captureClientError(error, { source: 'waitlist-submit' });
      setStatus('error');
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6 md:p-8">
      <Card className="gradient-bg border-0">
        <Pill>Waitlist</Pill>
        <h1 className="mt-3 text-3xl font-bold text-ink">Request access to Meet me alpha</h1>
        <p className="mt-2 text-slate-600">
          Join the waitlist if you are not yet in the current closed alpha batch.
        </p>
      </Card>

      <Card className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink">Name</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-ink">Email</label>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-ink">Why do you want access?</label>
          <textarea
            value={context}
            onChange={(event) => setContext(event.target.value)}
            className="min-h-32"
            placeholder="Tell us a bit about yourself and how you would use Meet me."
          />
        </div>

        <button
          disabled={!email.trim() || status === 'sending'}
          onClick={submit}
          className="rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {status === 'sending' ? 'Submitting…' : 'Join waitlist'}
        </button>

        {status === 'done' ? (
          <div className="text-sm text-emerald-700">Thanks — your request was submitted.</div>
        ) : null}

        {status === 'error' ? (
          <div className="text-sm text-rose-700">Could not submit your request.</div>
        ) : null}
      </Card>
    </div>
  );
}
