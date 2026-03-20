import type { Group, Post, SearchResult, UserProfile } from '@/lib/types';

export function buildSearchResults(query: string, groups: Group[], posts: Post[], profile: UserProfile): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const groupResults: SearchResult[] = groups
    .filter((group) =>
      [group.name, group.description, group.category, group.tags.join(' ')].join(' ').toLowerCase().includes(q)
    )
    .slice(0, 5)
    .map((group) => ({
      id: `group-${group.id}`,
      kind: 'group',
      title: group.name,
      subtitle: `${group.memberCount.toLocaleString()} members · ${group.category}`,
      href: `/groups/${group.slug}`
    }));

  const postResults: SearchResult[] = posts
    .filter((post) =>
      [post.content, post.author, post.groupName].join(' ').toLowerCase().includes(q)
    )
    .slice(0, 5)
    .map((post) => ({
      id: `post-${post.id}`,
      kind: 'post',
      title: `${post.author} in ${post.groupName}`,
      subtitle: post.content.slice(0, 100),
      href: `/groups/${post.groupId}`
    }));

  const profileCorpus = [profile.displayName, profile.username, profile.bio, profile.interests.join(' ')].join(' ').toLowerCase();
  const userResults: SearchResult[] = profileCorpus.includes(q)
    ? [{
        id: `user-${profile.username}`,
        kind: 'user',
        title: profile.displayName,
        subtitle: `@${profile.username}`,
        href: `/profile/${profile.username}`
      }]
    : [];

  return [...groupResults, ...postResults, ...userResults].slice(0, 10);
}
