'use client';

import { useEffect, useState } from 'react';
import { Card, Pill } from '@/components/ui';
import { supabaseEnabled } from '@/lib/supabase/client';
import { createBetaInvite, getBetaInvites, updateBetaInviteState, type BetaInviteRow } from '@/lib/supabase/beta-readiness';

const demoRows: BetaInviteRow[] = [
  { id: 'b1', email: 'creator@example.com', source: 'waitlist', state: 'draft', inviteToken: 'BETA-CREATOR-123ABC', notes: 'Creator candidate', createdAt: 'Today' },
  { id: 'b2', email: 'tester@example.com', source: 'waitlist', state: 'sent', inviteToken: 'BETA-TESTER-456DEF', notes: 'Community tester', createdAt: 'Today' }
];

export default function BetaInvitesPage() {
  const [rows, setRows] = useState<BetaInviteRow[]>(demoRows);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!supabaseEnabled) return;
    setLoading(true);
    try {
      setRows(await getBetaInvites());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function createInvite() {
    if (!email.trim()) return;
    if (supabaseEnabled) {
      await createBetaInvite(email.trim(), 'waitlist', 'Prepared for beta');
      await load();
    } else {
      setRows((current) => [
        {
          id: `local-${Date.now()}`,
          email: email.trim(),
          source: 'waitlist',
          state: 'draft',
          inviteToken: 'BETA-DEMO-TOKEN',
          notes: 'Prepared for beta',
          createdAt: 'Just now'
        },
        ...current
      ]);
    }
    setEmail('');
  }

  async function setStateValue(id: string, state: BetaInviteRow['state']) {
    if (supabaseEnabled) {
      await updateBetaInviteState(id, state);
      await load();
      return;
    }
    setRows((current) => current.map((item) => item.id === id ? { ...item, state } : item));
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 md:p-8">
      <Card className="gradient-bg border-0">
        <Pill>Beta invites</Pill>
        <h1 className="mt-3 text-3xl font-bold text-ink">Beta access preparation</h1>
        <p className="mt-2 text-slate-600">Create and track beta invite records before widening access beyond alpha.</p>
      </Card>

      <Card className="space-y-4">
        <div className="text-lg font-semibold text-ink">Create beta invite</div>
        <div className="flex gap-3">
          <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="tester@example.com" />
          <button onClick={createInvite} className="rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white">
            Create
          </button>
        </div>
      </Card>

      {loading ? <Card><div className="text-sm text-slate-500">Loading beta invites…</div></Card> : null}

      <div className="space-y-4">
        {rows.map((row) => (
          <Card key={row.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-ink">{row.email}</div>
                <div className="mt-1 text-sm text-slate-500">{row.inviteToken}</div>
                <div className="mt-1 text-xs text-slate-400">{row.source} · {row.createdAt}</div>
              </div>
              <select value={row.state} onChange={(event) => setStateValue(row.id, event.target.value as BetaInviteRow['state'])} className="max-w-[140px]">
                <option value="draft">draft</option>
                <option value="sent">sent</option>
                <option value="accepted">accepted</option>
                <option value="expired">expired</option>
              </select>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
