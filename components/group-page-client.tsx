'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FeedPost } from '@/components/feed-post';
import { Button, Card, Pill } from '@/components/ui';
import { useStore } from '@/lib/store';

export function GroupPageClient({ slug }: { slug: string }) {
  const { state, toggleJoinGroup } = useStore();
  const group = state.groups.find((item) => item.slug === slug);
  if (!group) return notFound();
  const posts = state.posts.filter((post) => post.groupId === group.id);

  return (
    <div className="space-y-6 p-6 md:p-8">
      <Card className="space-y-4 gradient-bg border-0">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-ink">{group.name}</h1>
            <p className="mt-2 max-w-3xl text-slate-600">{group.description}</p>
          </div>
          <div className="flex gap-3">
            <button className="rounded-2xl border bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-50" onClick={() => toggleJoinGroup(group.slug)}>{group.joined ? 'Joined' : 'Join group'}</button>
            <Link href={`/groups/${group.slug}/chat`}><Button className="bg-slate-900">Open chat</Button></Link>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {group.tags.map((tag) => <Pill key={tag}>{tag}</Pill>)}
        </div>
      </Card>
      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <section className="space-y-6">
          {posts.length ? posts.map((post) => <FeedPost key={post.id} post={post} />) : <Card>No posts yet in this group.</Card>}
        </section>
        <aside>
          <Card className="space-y-3">
            <div className="text-lg font-semibold text-ink">About this group</div>
            <p className="text-sm text-slate-600">Public community · {group.memberCount.toLocaleString()} members</p>
            <p className="text-sm text-slate-600">Rules: be respectful, stay on topic, no spam, and add something useful when you post.</p>
          </Card>
        </aside>
      </div>
    </div>
  );
}
