'use client';

import { useParams } from 'next/navigation';
import { Card, Pill } from '@/components/ui';
import { useStore } from '@/lib/store';
import { buildUserDirectory, followerCount, followingCount, isFollowing } from '@/lib/user-directory';

export default function ProfilePage() {
  const params = useParams<{ username: string }>();
  const username = typeof params?.username === 'string' ? params.username : '';
  const { state, toggleFollowUser } = useStore();
  const directory = buildUserDirectory(state.profile, state.posts, state.comments);
  const person = directory.find((item) => item.username === username) || {
    username: state.profile.username,
    displayName: state.profile.displayName,
    bio: state.profile.bio
  };

  const isSelf = person.username === state.profile.username;
  const follows = isFollowing(state.follows, state.profile.username, person.username);
  const userPosts = state.posts.filter((post) => post.authorUsername === person.username);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6 md:p-8">
      <Card className="gradient-bg border-0">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl font-bold text-brand">
              {person.displayName.slice(0, 1)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-ink">{person.displayName}</h1>
              <p className="mt-1 text-slate-500">@{person.username}</p>
              <p className="mt-3 max-w-2xl text-slate-700">{person.bio}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="rounded-2xl bg-white px-4 py-3 text-center">
              <div className="text-2xl font-bold text-ink">{followerCount(state.follows, person.username)}</div>
              <div className="text-sm text-slate-500">Followers</div>
            </div>
            <div className="rounded-2xl bg-white px-4 py-3 text-center">
              <div className="text-2xl font-bold text-ink">{followingCount(state.follows, person.username)}</div>
              <div className="text-sm text-slate-500">Following</div>
            </div>
            {!isSelf ? (
              <button
                className={follows ? 'rounded-2xl border bg-white px-4 py-3 text-sm font-semibold' : 'rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white'}
                onClick={() => toggleFollowUser(person.username)}
              >
                {follows ? 'Following' : 'Follow'}
              </button>
            ) : null}
          </div>
        </div>
      </Card>

      {isSelf ? (
        <Card>
          <div className="text-lg font-semibold text-ink">Interests</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {state.profile.interests.map((interest) => <Pill key={interest}>{interest}</Pill>)}
          </div>
        </Card>
      ) : null}

      <Card className="space-y-4">
        <div className="text-lg font-semibold text-ink">Recent posts</div>
        {userPosts.length ? userPosts.map((post) => (
          <div key={post.id} className="rounded-2xl border p-4">
            <div className="text-sm font-semibold text-ink">{post.groupName}</div>
            <div className="mt-2 text-sm text-slate-600">{post.content}</div>
          </div>
        )) : <div className="text-sm text-slate-500">No posts yet.</div>}
      </Card>
    </div>
  );
}
