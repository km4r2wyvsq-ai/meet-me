import type { Group, Post, RecommendationBundle, UserProfile } from '@/lib/types';

export function rankGroups(groups: Group[], profile: UserProfile): Group[] {
  const interests = new Set(profile.interests.map((item) => item.toLowerCase()));
  return [...groups]
    .map((group) => {
      const categoryBoost = interests.has(group.category.toLowerCase()) ? 35 : 0;
      const tagBoost = group.tags.reduce((sum, tag) => sum + (interests.has(tag.toLowerCase()) ? 12 : 0), 0);
      const joinedBoost = group.joined ? 20 : 0;
      const sizeBoost = Math.min(20, Math.round(group.memberCount / 100));
      return { ...group, recommendedScore: categoryBoost + tagBoost + joinedBoost + sizeBoost };
    })
    .sort((a, b) => (b.recommendedScore ?? 0) - (a.recommendedScore ?? 0));
}

export function rankPosts(posts: Post[], groups: Group[], profile: UserProfile): Post[] {
  const rankedGroups = new Map(rankGroups(groups, profile).map((group) => [group.id, group.recommendedScore ?? 0]));
  return [...posts]
    .map((post) => {
      const groupScore = rankedGroups.get(post.groupId) ?? 0;
      const engagementScore = post.likes + post.comments * 3;
      const imageBoost = post.image ? 8 : 0;
      const trendBoost = post.trend === 'hot' ? 14 : post.trend === 'rising' ? 10 : 4;
      return { ...post, score: groupScore + engagementScore + imageBoost + trendBoost };
    })
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}

export function buildRecommendations(groups: Group[], posts: Post[], profile: UserProfile): RecommendationBundle {
  const rankedGroups = rankGroups(groups, profile);
  const rankedPosts = rankPosts(posts, groups, profile);
  return {
    groups: rankedGroups.filter((group) => !group.joined).slice(0, 4),
    posts: rankedPosts.slice(0, 4)
  };
}
