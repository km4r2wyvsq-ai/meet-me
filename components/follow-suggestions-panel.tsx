'use client';

import Link from 'next/link';
import { UserPlus } from 'lucide-react';
import { Card } from '@/components/ui';
import { useStore } from '@/lib/store';
import { buildUserDirectory, isFollowing } from '@/lib/user-directory';

export function FollowSuggestionsPanel() {
  const { state, toggleFollowUser } = useStore();
  const people = buildUserDirectory(state.profile, state.posts, state.comments)
    .filter((person) => person.username !== state.profile.username)
    .filter((person) => !isFollowing(state.follows, state.profile.username, person.username))
    .slice(0, 4);

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2">
        <UserPlus size={18} />
        <div className="text-lg font-semibold text-ink">People to follow</div>
      </div>
      <div className="space-y-3">
        {people.length ? people.map((person) => (
          <div key={person.username} className="rounded-2xl border p-4">
            <div className="font-semibold text-ink">{person.displayName}</div>
            <div className="text-sm text-slate-500">@{person.username}</div>
            <div className="mt-2 text-sm text-slate-600">{person.bio}</div>
            <div className="mt-3 flex gap-2">
              <Link href={`/profile/${person.username}`} className="rounded-xl border px-3 py-2 text-sm font-medium hover:bg-slate-50">
                View
              </Link>
              <button
                className="rounded-xl bg-brand px-3 py-2 text-sm font-semibold text-white"
                onClick={() => toggleFollowUser(person.username)}
              >
                Follow
              </button>
            </div>
          </div>
        )) : (
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No new people to follow right now.</div>
        )}
      </div>
    </Card>
  );
}
