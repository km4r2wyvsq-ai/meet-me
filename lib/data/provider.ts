import { initialState } from '@/lib/seed';
import type { AppState } from '@/lib/types';

export async function getInitialAppState(): Promise<AppState> {
  const profile = initialState.profile;
  const groups = initialState.groups;
  const posts = initialState.posts;
  const comments = initialState.comments;
  const messages = initialState.messages;
  const notifications = initialState.notifications;
  const reports = initialState.reports;
  const analyticsEvents = initialState.analyticsEvents;
  const searchQuery = initialState.searchQuery;
  const searchResults = initialState.searchResults;
  const presenceByGroup = initialState.presenceByGroup;
  const invites = initialState.invites;
  const recommendations = initialState.recommendations;
  const follows = initialState.follows;
  const feedMode = initialState.feedMode;
  const networkMode = initialState.networkMode;

  return {
    authenticated: Boolean(profile),
    profile: profile ?? initialState.profile,
    groups,
    posts,
    comments,
    messages,
    notifications,
    reports,
    analyticsEvents,
    searchQuery,
    searchResults,
    presenceByGroup,
    invites,
    recommendations,
    follows,
    feedMode,
    networkMode,
  };
}
