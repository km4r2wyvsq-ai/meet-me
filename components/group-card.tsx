'use client';

import Link from 'next/link';
import { Button, Card, Pill } from '@/components/ui';
import { Group } from '@/lib/types';
import { useStore } from '@/lib/store';

export function GroupCard({ group }: { group: Group }) {
  const { toggleJoinGroup } = useStore();

  return (
    <Card className="space-y-4">
      <div className="space-y-2">
        <div className="text-lg font-semibold text-ink">{group.name}</div>
        <p className="text-sm text-slate-600">{group.description}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {group.tags.map((tag) => <Pill key={tag}>{tag}</Pill>)}
      </div>
      <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
        <span>{group.memberCount.toLocaleString()} members</span>
        <div className="flex gap-2">
          <button className="rounded-xl border px-3 py-2 font-medium hover:bg-slate-50" onClick={() => toggleJoinGroup(group.slug)}>
            {group.joined ? 'Joined' : 'Join'}
          </button>
          <Link href={`/groups/${group.slug}`}>
            <Button className="px-3 py-2 text-xs">Open</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
