import type { Comment, Follow, Post, UserDirectoryProfile, UserProfile } from '@/lib/types';

export function buildUserDirectory(profile: UserProfile, posts: Post[], comments: Comment[]): UserDirectoryProfile[] {
  const map = new Map<string, UserDirectoryProfile>();
  map.set(profile.username, {
    username: profile.username,
    displayName: profile.displayName,
    bio: profile.bio
  });

  for (const post of posts) {
    if (!map.has(post.authorUsername)) {
      map.set(post.authorUsername, {
        username: post.authorUsername,
        displayName: post.author,
        bio: `${post.groupName} contributor`
      });
    }
  }

  for (const comment of comments) {
    if (!map.has(comment.authorUsername)) {
      map.set(comment.authorUsername, {
        username: comment.authorUsername,
        displayName: comment.author,
        bio: 'Active community member'
      });
    }
  }

  return Array.from(map.values());
}

export function isFollowing(follows: Follow[], followerUsername: string, followingUsername: string) {
  return follows.some(
    (item) => item.followerUsername === followerUsername && item.followingUsername === followingUsername
  );
}

export function followerCount(follows: Follow[], username: string) {
  return follows.filter((item) => item.followingUsername === username).length;
}

export function followingCount(follows: Follow[], username: string) {
  return follows.filter((item) => item.followerUsername === username).length;
}
