'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Card, Pill } from '@/components/ui';
import { useStore } from '@/lib/store';

export function RecommendationsPanel() {
  const { state } = useStore();

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles size={18} />
        <div className="text-lg font-semibold text-ink">Recommended for you</div>
      </div>

      <div className="space-y-3">
        {state.recommendations.groups.length ? state.recommendations.groups.map((group) => (
          <Link key={group.id} href={`/groups/${group.slug}`} className="block rounded-2xl border p-4 hover:bg-slate-50">
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold text-ink">{group.name}</div>
              <Pill>{group.recommendedScore}</Pill>
            </div>
            <div className="mt-1 text-sm text-slate-500">{group.description}</div>
          </Link>
        )) : <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No new group recommendations yet.</div>}
      </div>

      <div className="rounded-2xl bg-slate-50 p-4">
        <div className="text-sm font-semibold text-ink">Top content signal</div>
        <div className="mt-2 text-sm text-slate-600">
          {state.recommendations.posts[0]
            ? `${state.recommendations.posts[0].author} in ${state.recommendations.posts[0].groupName}`
            : 'No post recommendations yet.'}
        </div>
      </div>
    </Card>
  );
}
