'use client';

import { AnalyticsPanel } from '@/components/analytics-panel';
import { CreatePostCard } from '@/components/create-post-card';
import { FeedPost } from '@/components/feed-post';
import { GroupCard } from '@/components/group-card';
import { NotificationsPanel } from '@/components/notifications-panel';
import { SearchPanel } from '@/components/search-panel';
import { RecommendationsPanel } from '@/components/recommendations-panel';
import { InvitePanel } from '@/components/invite-panel';
import { InviteAcceptPanel } from '@/components/invite-accept-panel';
import { FollowSuggestionsPanel } from '@/components/follow-suggestions-panel';
import { Card, Pill } from '@/components/ui';
import { useStore } from '@/lib/store';
import { supabaseEnabled } from '@/lib/supabase/client';

export default function HomePage() {
  const { state, syncing, setFeedMode } = useStore();
  const joinedGroups = state.groups.filter((group) => group.joined);
  const visiblePosts = state.feedMode === 'following'
    ? state.posts.filter((post) => post.authorUsername === state.profile.username || state.follows.some((follow) => follow.followerUsername === state.profile.username && follow.followingUsername === post.authorUsername))
    : state.posts;

  return (
    <div className="grid gap-6 p-6 md:p-8 xl:grid-cols-[1fr_340px]">
      <section className="space-y-6">
        <Card className="gradient-bg space-y-3 border-0">
          <div className="flex flex-wrap items-center gap-3">
            <Pill>Founder dashboard</Pill>
            <Pill className={supabaseEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}>
              {supabaseEnabled ? 'Supabase mode' : 'Demo mode'}
            </Pill>
            {syncing ? <Pill className="bg-amber-100 text-amber-700">Syncing…</Pill> : null}
          </div>
          <h1 className="text-3xl font-bold text-ink">Welcome back, {state.profile.displayName}</h1>
          <p className="text-slate-600">This build adds follow relationships, invite acceptance, and feed mode switching for a more network-like product.</p>
          <div className="flex gap-3">
            <button
              className={state.feedMode === 'for-you' ? 'rounded-2xl bg-brand px-4 py-2 text-sm font-semibold text-white' : 'rounded-2xl border px-4 py-2 text-sm font-medium'}
              onClick={() => setFeedMode('for-you')}
            >
              For you
            </button>
            <button
              className={state.feedMode === 'following' ? 'rounded-2xl bg-brand px-4 py-2 text-sm font-semibold text-white' : 'rounded-2xl border px-4 py-2 text-sm font-medium'}
              onClick={() => setFeedMode('following')}
            >
              Following
            </button>
          </div>
        </Card>
        <CreatePostCard />
        {visiblePosts.map((post) => <FeedPost key={post.id} post={post} />)}
      </section>
      <aside className="space-y-6">
        <SearchPanel />
        <RecommendationsPanel />
        <FollowSuggestionsPanel />
        <InvitePanel />
        <InviteAcceptPanel />
        <AnalyticsPanel />
        <NotificationsPanel />
        <Card>
          <div className="text-lg font-semibold text-ink">Your communities</div>
          <div className="mt-4 space-y-4">
            {joinedGroups.map((group) => <GroupCard key={group.id} group={group} />)}
          </div>
        </Card>
      </aside>
    </div>
  );
}
