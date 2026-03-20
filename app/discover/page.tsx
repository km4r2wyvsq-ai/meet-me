'use client';

import { CreateGroupCard } from '@/components/create-group-card';
import { GroupCard } from '@/components/group-card';
import { Card, Pill } from '@/components/ui';
import { useStore } from '@/lib/store';

export default function DiscoverPage() {
  const { state } = useStore();

  return (
    <div className="space-y-6 p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-bold text-ink">Discover communities</h1>
        <p className="mt-2 text-slate-500">Browse public groups based on your interests, founder-style niches, and early activity signals.</p>
      </div>
      <Card className="flex flex-wrap gap-3">
        {['Trending', 'Photography', 'Travel', 'Food', 'Tech', 'Creators', 'Startups'].map((tag) => <Pill key={tag}>{tag}</Pill>)}
      </Card>
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-5 md:grid-cols-2">
          {state.groups.map((group) => <GroupCard key={group.id} group={group} />)}
        </div>
        <CreateGroupCard />
      </div>
    </div>
  );
}
