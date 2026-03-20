import { initialState } from '@/lib/seed';
import type { AppState, Group, UserProfile } from '@/lib/types';
import { supabaseEnabled } from '@/lib/supabase/client';
import * as repo from '@/lib/supabase/repository';

export async function loadInitialAppState(): Promise<AppState> {
  if (!supabaseEnabled) return initialState;

  const [profile, groups, posts] = await Promise.all([
    repo.getSessionProfile(),
    repo.getGroups(),
    repo.getPosts()
  ]);

  return {
    authenticated: Boolean(profile),
    profile: profile ?? initialState.profile,
    groups,
    posts,
    messages: initialState.messages,
    notifications: await repo.getNotifications(),
    reports: await repo.getReports(),
    analyticsEvents: initialState.analyticsEvents
  };
}

export async function refreshGroups(): Promise<Group[]> {
  if (!supabaseEnabled) return initialState.groups;
  return repo.getGroups();
}

export async function refreshProfile(): Promise<UserProfile | null> {
  if (!supabaseEnabled) return initialState.profile;
  return repo.getSessionProfile();
}
