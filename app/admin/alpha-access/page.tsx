'use client';

import { useEffect, useState } from 'react';
import { Card, Pill } from '@/components/ui';
import { supabaseEnabled } from '@/lib/supabase/client';
import { getAlphaAccessList, getWaitlistRequests, upsertAlphaAccess, updateWaitlistStatus } from '@/lib/supabase/alpha-access';
import type { AlphaAccessItem, WaitlistRequestItem } from '@/lib/types';

const demoAccess: AlphaAccessItem[] = [
  { id: 'a1', email: 'founder@meetme.app', accessState: 'approved', inviteCode: 'FOUNDER-ALPHA', note: 'Core operator', createdAt: 'Today' },
  { id: 'a2', email: 'creator1@example.com', accessState: 'approved', inviteCode: 'CREATOR-01', note: 'Creator batch', createdAt: 'Today' }
];

const demoWaitlist: WaitlistRequestItem[] = [
  { id: 'w1', email: 'tester1@example.com', name: 'Tester One', context: 'Interested in creator communities', status: 'new', createdAt: 'Today' },
  { id: 'w2', email: 'tester2@example.com', name: 'Tester Two', context: 'Wants to test group chat and invites', status: 'reviewed', createdAt: 'Today' }
];

export default function AlphaAccessPage() {
  const [accessItems, setAccessItems] = useState<AlphaAccessItem[]>(demoAccess);
  const [waitlist, setWaitlist] = useState<WaitlistRequestItem[]>(demoWaitlist);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!supabaseEnabled) return;
    setLoading(true);
    try {
      const [access, waitlistRows] = await Promise.all([getAlphaAccessList(), getWaitlistRequests()]);
      setAccessItems(access);
      setWaitlist(waitlistRows);
    } finally {
      setLoading(false);
    }
  }

  async function approve(email: string) {
    if (supabaseEnabled) {
      await upsertAlphaAccess({
        email,
        accessState: 'approved',
        inviteCode: `ALPHA-${email.split('@')[0].toUpperCase()}`,
        note: 'Approved for alpha'
      });
      const target = waitlist.find((item) => item.email === email);
      if (target) {
        await updateWaitlistStatus(target.id, 'invited');
      }
      await load();
      return;
    }

    setAccessItems((current) => [
      { id: `local-${current.length + 1}`, email, accessState: 'approved', inviteCode: 'ALPHA-DEMO', note: 'Approved for alpha', createdAt: 'Just now' },
      ...current
    ]);
    setWaitlist((current) => current.map((item) => item.email === email ? { ...item, status: 'invited' } : item));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 md:p-8">
      <Card className="gradient-bg border-0">
        <Pill>Alpha access</Pill>
        <h1 className="mt-3 text-3xl font-bold text-ink">Invite-only access control</h1>
        <p className="mt-2 text-slate-600">Approve waitlist users and track who has alpha access.</p>
      </Card>

      {loading ? <Card><div className="text-sm text-slate-500">Loading alpha access…</div></Card> : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="space-y-4">
          <div className="text-lg font-semibold text-ink">Approved alpha users</div>
          <div className="space-y-3">
            {accessItems.map((item) => (
              <div key={item.id} className="rounded-2xl border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-ink">{item.email}</div>
                  <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">{item.accessState}</span>
                </div>
                <div className="mt-2 text-sm text-slate-600">{item.inviteCode || 'No invite code'}</div>
                <div className="mt-1 text-xs text-slate-400">{item.note || ''}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="text-lg font-semibold text-ink">Waitlist requests</div>
          <div className="space-y-3">
            {waitlist.map((item) => (
              <div key={item.id} className="rounded-2xl border p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-ink">{item.name || item.email}</div>
                    <div className="mt-1 text-sm text-slate-500">{item.email}</div>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{item.status}</span>
                </div>
                <div className="mt-3 text-sm text-slate-600">{item.context}</div>
                <div className="mt-3">
                  <button
                    onClick={() => approve(item.email)}
                    className="rounded-xl bg-brand px-3 py-2 text-xs font-semibold text-white"
                  >
                    Approve for alpha
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
