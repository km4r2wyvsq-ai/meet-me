'use client';

import { useEffect, useState } from 'react';
import { Card, Pill } from '@/components/ui';
import { captureClientError } from '@/lib/monitoring';
import { supabaseEnabled } from '@/lib/supabase/client';
import { getMyFeedback } from '@/lib/supabase/feedback';
import type { FeedbackItem } from '@/lib/types';

export default function FeedbackPage() {
  const [category, setCategory] = useState('bug');
  const [message, setMessage] = useState('');
  const [page, setPage] = useState('/home');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [items, setItems] = useState<FeedbackItem[]>([]);

  async function loadFeedback() {
    if (!supabaseEnabled) return;
    try {
      setItems(await getMyFeedback());
    } catch (error) {
      captureClientError(error, { source: 'feedback-load' });
    }
  }

  useEffect(() => {
    loadFeedback();
  }, []);

  async function submit() {
    setStatus('sending');
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, message, page })
      });
      if (!response.ok) throw new Error('Failed to submit feedback');
      setStatus('done');
      setMessage('');
      await loadFeedback();
    } catch (error) {
      captureClientError(error, { category, page });
      setStatus('error');
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6 md:p-8">
      <Card className="gradient-bg border-0">
        <Pill>Feedback center</Pill>
        <h1 className="mt-3 text-3xl font-bold text-ink">Tell us what broke or what should improve</h1>
        <p className="mt-2 text-slate-600">This page is intended for closed alpha testers and internal operators.</p>
      </Card>

      <Card className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink">Category</label>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="bug">Bug</option>
            <option value="idea">Idea</option>
            <option value="ux">UX</option>
            <option value="performance">Performance</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-ink">Page</label>
          <input value={page} onChange={(event) => setPage(event.target.value)} placeholder="/home" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-ink">Message</label>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Describe the issue, friction, or idea..."
            className="min-h-40"
          />
        </div>

        <button
          disabled={!message.trim() || status === 'sending'}
          onClick={submit}
          className="rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {status === 'sending' ? 'Sending…' : 'Submit feedback'}
        </button>

        {status === 'done' ? <div className="text-sm text-emerald-700">Thanks — your feedback was submitted.</div> : null}
        {status === 'error' ? <div className="text-sm text-rose-700">Could not submit feedback. Try again.</div> : null}
      </Card>

      <Card className="space-y-4">
        <div className="text-lg font-semibold text-ink">Your submitted feedback</div>
        {!supabaseEnabled ? (
          <div className="text-sm text-slate-500">Enable Supabase mode to persist and review your submissions.</div>
        ) : items.length ? (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl border p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{item.category}</span>
                  <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">{item.status}</span>
                  <span className="text-xs text-slate-400">{item.createdAt}</span>
                </div>
                <div className="mt-3 text-sm text-slate-700">{item.message}</div>
                <div className="mt-2 text-xs text-slate-500">{item.page}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-slate-500">No feedback submitted yet.</div>
        )}
      </Card>
    </div>
  );
}
