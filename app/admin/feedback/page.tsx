'use client';

import { useEffect, useState } from 'react';
import { Card, Pill } from '@/components/ui';
import { supabaseEnabled } from '@/lib/supabase/client';
import { getAdminFeedback, updateFeedbackStatus } from '@/lib/supabase/feedback';
import type { FeedbackItem, FeedbackStatus } from '@/lib/types';

const fallbackItems: FeedbackItem[] = [
  {
    id: 'f1',
    category: 'ux',
    page: '/home',
    status: 'new',
    message: 'The invite and follow controls are powerful, but first-time users may need stronger explanation.',
    createdAt: 'Today'
  },
  {
    id: 'f2',
    category: 'bug',
    page: '/groups/build-in-public/chat',
    status: 'reviewed',
    message: 'Typing state clears a bit late after sending a message in some demo flows.',
    createdAt: 'Today'
  },
  {
    id: 'f3',
    category: 'idea',
    page: '/creator',
    status: 'planned',
    message: 'Creator analytics should include retention cohorts and post-to-comment conversion.',
    createdAt: 'Today'
  }
];

export default function AdminFeedbackPage() {
  const [items, setItems] = useState<FeedbackItem[]>(fallbackItems);
  const [loading, setLoading] = useState(false);

  async function loadItems() {
    if (!supabaseEnabled) return;
    setLoading(true);
    try {
      setItems(await getAdminFeedback());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function setStatus(id: string, status: FeedbackStatus) {
    if (!supabaseEnabled) {
      setItems((current) => current.map((item) => item.id === id ? { ...item, status } : item));
      return;
    }
    await updateFeedbackStatus(id, status);
    await loadItems();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 md:p-8">
      <Card className="gradient-bg border-0">
        <Pill>Admin feedback inbox</Pill>
        <h1 className="mt-3 text-3xl font-bold text-ink">Feedback triage</h1>
        <p className="mt-2 text-slate-600">Use this surface to review alpha feedback themes and prioritize fixes.</p>
      </Card>

      {loading ? <Card><div className="text-sm text-slate-500">Loading feedback…</div></Card> : null}

      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{item.category}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{item.page}</span>
                <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">{item.status}</span>
              </div>
              <select
                value={item.status}
                onChange={(event) => setStatus(item.id, event.target.value as FeedbackStatus)}
                className="max-w-[160px]"
              >
                <option value="new">new</option>
                <option value="reviewed">reviewed</option>
                <option value="planned">planned</option>
                <option value="closed">closed</option>
              </select>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => fetch('/api/admin/escalate-feedback', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ feedbackId: item.id, reason: 'urgent_bug' })
                })}
                className="rounded-xl border px-3 py-2 text-xs font-semibold hover:bg-slate-50"
              >
                Escalate
              </button>
            </div>
            <div className="mt-4 text-sm text-slate-700">{item.message}</div>
            <div className="mt-2 text-xs text-slate-400">{item.createdAt}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
