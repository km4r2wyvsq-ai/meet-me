'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui';
import { useStore } from '@/lib/store';

export function SearchPanel() {
  const { state, setSearchQuery } = useStore();

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2">
        <Search size={18} />
        <div className="text-lg font-semibold text-ink">Search</div>
      </div>
      <input
        value={state.searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder="Search groups, posts, people..."
      />
      <div className="space-y-3">
        {state.searchResults.length ? state.searchResults.map((item) => (
          <Link key={item.id} href={item.href} className="block rounded-2xl border p-4 hover:bg-slate-50">
            <div className="text-sm font-semibold uppercase tracking-wide text-slate-400">{item.kind}</div>
            <div className="mt-1 font-semibold text-ink">{item.title}</div>
            <div className="mt-1 text-sm text-slate-500">{item.subtitle}</div>
          </Link>
        )) : <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">Type to search communities, posts, and people.</div>}
      </div>
    </Card>
  );
}
