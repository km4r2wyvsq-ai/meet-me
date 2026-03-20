'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Analytics, AnalyticsEvent, AppState, Comment, Follow, Group, Invite, Message, Post, ReportItem, Role, FeedMode } from '@/lib/types';
import { initialState } from '@/lib/seed';
import { uploadImage } from '@/lib/supabase/storage';
import { captureEvent, identifyUser, resetAnalytics } from '@/lib/analytics/client';
import { canChangeRoles, canResolveReports } from '@/lib/permissions';
import { supabaseEnabled } from '@/lib/supabase/client';
import * as repo from '@/lib/supabase/repository';
import { subscribeToFeed, subscribeToMessages, subscribeToReports } from '@/lib/supabase/realtime';
import { createPresenceChannel } from '@/lib/supabase/presence';
import { buildSearchResults } from '@/lib/search';
import { buildRecommendations, rankPosts } from '@/lib/recommendations';

const STORAGE_KEY = 'meet-me-startup-state';

type StoreValue = {
  state: AppState;
  hydrated: boolean;
  syncing: boolean;
  analytics: Analytics;
  login: (email: string, password?: string) => Promise<void>;
  signup: (email: string, username: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshApp: () => Promise<void>;
  updateProfile: (updates: Partial<AppState['profile']>) => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
  setRole: (role: Role) => Promise<void>;
  setFeedMode: (mode: FeedMode) => void;
  setSearchQuery: (query: string) => void;
  setTypingStateForGroup: (groupId: string, typing: boolean) => void;
  attachPresenceToGroup: (groupId: string) => () => void;
  toggleInterest: (interest: string) => Promise<void>;
  toggleJoinGroup: (slug: string) => Promise<void>;
  createGroup: (input: { name: string; description: string; category: string }) => Promise<void>;
  createPost: (input: { groupId: string; content: string; imageFile?: File | null }) => Promise<void>;
  createCommentOnPost: (postId: string, content: string) => Promise<void>;
  toggleLikeOnPost: (postId: string, currentlyLiked: boolean) => Promise<void>;
  toggleFollowUser: (username: string) => void;
  createInviteLink: (groupId: string) => void;
  acceptInviteCode: (code: string) => void;
  sendMessage: (groupId: string, content: string, imageFile?: File | null) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  createReport: (input: { targetType: ReportItem['targetType']; targetId: string; reason: string }) => Promise<void>;
  resolveReport: (reportId: string) => Promise<void>;
  loadGroupMessages: (groupId: string) => Promise<void>;
};

const StoreContext = createContext<StoreValue | null>(null);

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function pushNotification(state: AppState, item: AppState['notifications'][number]): AppState {
  return { ...state, notifications: [item, ...state.notifications] };
}

function pushEvent(state: AppState, event: AnalyticsEvent): AppState {
  return { ...state, analyticsEvents: [event, ...state.analyticsEvents].slice(0, 40) };
}

function makeEvent(name: string, actor: string, detail: string): AnalyticsEvent {
  return {
    id: `e${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    actor,
    detail,
    createdAt: new Date().toLocaleString()
  };
}

function mergeGroupMessages(existing: Message[], incoming: Message[], groupId: string) {
  return [...existing.filter((message) => message.groupId !== groupId), ...incoming];
}

function withDerivedState(state: AppState): AppState {
  const rankedPosts = rankPosts(state.posts, state.groups, state.profile);
  return {
    ...state,
    posts: rankedPosts,
    searchResults: buildSearchResults(state.searchQuery, state.groups, rankedPosts, state.profile),
    recommendations: buildRecommendations(state.groups, rankedPosts, state.profile)
  };
}

function makeInviteCode(groupName: string) {
  return `${groupName.toUpperCase().replace(/[^A-Z0-9]+/g, '-').slice(0, 12)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(withDerivedState(initialState));
  const [hydrated, setHydrated] = useState(false);
  const [syncing, setSyncing] = useState(false);

  async function refreshFromSupabase() {
    if (!supabaseEnabled) return;
    setSyncing(true);
    try {
      const [profile, groups, posts, comments, notifications, reports, analyticsEvents] = await Promise.all([
        repo.getSessionProfile(),
        repo.getGroups(),
        repo.getPosts(),
        repo.getComments(),
        repo.getNotifications(),
        repo.getReports(),
        repo.getAuditEvents()
      ]);
      setState((current) => withDerivedState({
        ...current,
        authenticated: Boolean(profile),
        profile: profile ?? current.profile,
        groups,
        posts,
        comments,
        notifications,
        reports,
        analyticsEvents
      }));
    } finally {
      setSyncing(false);
    }
  }

  async function loadGroupMessages(groupId: string) {
    if (!supabaseEnabled) return;
    const messages = await repo.getMessages(groupId);
    setState((current) => ({ ...current, messages: mergeGroupMessages(current.messages, messages, groupId) }));
  }

  useEffect(() => {
    async function boot() {
      try {
        if (supabaseEnabled) {
          await refreshFromSupabase();
        } else {
          const raw = window.localStorage.getItem(STORAGE_KEY);
          if (raw) setState(withDerivedState(JSON.parse(raw)));
        }
      } catch {}
      setHydrated(true);
    }
    boot();
  }, []);

  useEffect(() => {
    if (!hydrated || supabaseEnabled) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  useEffect(() => {
    if (!supabaseEnabled || !hydrated || !state.authenticated) return;
    const groupId = state.groups.find((group) => group.joined)?.id;
    const unsubFeed = subscribeToFeed(() => refreshFromSupabase());
    const unsubMessages = groupId ? subscribeToMessages(groupId, () => loadGroupMessages(groupId)) : () => {};
    const unsubReports = subscribeToReports(() => refreshFromSupabase());

    return () => {
      unsubFeed();
      unsubMessages();
      unsubReports();
    };
  }, [hydrated, state.authenticated, state.groups]);

  const analytics = useMemo<Analytics>(() => {
    const joinedGroups = state.groups.filter((group) => group.joined).length;
    const postsCreated = state.posts.filter((post) => post.authorUsername === state.profile.username).length;
    const messagesSent = state.messages.filter((message) => message.author === state.profile.displayName).length;
    const profileCompletion = [
      state.profile.displayName,
      state.profile.bio,
      state.profile.avatarUrl,
      state.profile.interests.length ? 'yes' : ''
    ].filter(Boolean).length * 25;
    const notificationsUnread = state.notifications.filter((item) => !item.read).length;
    return { joinedGroups, postsCreated, messagesSent, profileCompletion, notificationsUnread };
  }, [state]);

  const value = useMemo<StoreValue>(() => ({
    state,
    hydrated,
    syncing,
    analytics,
    login: async (email, password = 'password123') => {
      if (supabaseEnabled) {
        await repo.signIn(email, password);
        await refreshFromSupabase();
        const profile = await repo.getSessionProfile();
        if (profile) identifyUser(profile.username, { email, role: profile.role });
        captureEvent('login', { email });
        return;
      }
      identifyUser(state.profile.username, { email, role: state.profile.role });
      captureEvent('login', { email });
      setState((current) => withDerivedState(pushEvent(
        { ...current, authenticated: true, profile: { ...current.profile, email } },
        makeEvent('login', current.profile.displayName, `Logged in with ${email}.`)
      )));
    },
    signup: async (email, username, password = 'password123') => {
      if (supabaseEnabled) {
        const slug = slugify(username);
        await repo.signUp(email, password, slug);
        identifyUser(slug, { email, role: 'member' });
        captureEvent('signup_completed', { email });
        await refreshFromSupabase();
        return;
      }
      const slug = slugify(username);
      identifyUser(slug, { email, role: state.profile.role });
      captureEvent('signup_completed', { email });
      setState((current) => withDerivedState(pushEvent(
        { ...current, authenticated: true, profile: { ...current.profile, email, username: slug, displayName: username } },
        makeEvent('signup', username, `Created a new account with ${email}.`)
      )));
    },
    logout: async () => {
      captureEvent('logout');
      resetAnalytics();
      if (supabaseEnabled) {
        await repo.signOut();
        setState((current) => ({ ...current, authenticated: false }));
        return;
      }
      setState((current) => withDerivedState(pushEvent(
        { ...current, authenticated: false },
        makeEvent('logout', current.profile.displayName, 'Signed out of the app.')
      )));
    },
    refreshApp: async () => { if (supabaseEnabled) await refreshFromSupabase(); },
    updateProfile: async (updates) => {
      captureEvent('profile_updated');
      if (supabaseEnabled) {
        await repo.updateProfile(updates);
        await refreshFromSupabase();
        return;
      }
      setState((current) => withDerivedState(pushEvent(
        { ...current, profile: { ...current.profile, ...updates } },
        makeEvent('profile_updated', current.profile.displayName, 'Updated profile fields.')
      )));
    },
    updateAvatar: async (file) => {
      const avatarUrl = await uploadImage(file, 'avatars');
      captureEvent('avatar_uploaded', { file_name: file.name });
      if (supabaseEnabled) {
        await repo.updateProfile({ avatarUrl });
        await refreshFromSupabase();
        return;
      }
      setState((current) => withDerivedState(pushEvent(
        pushNotification(
          { ...current, profile: { ...current.profile, avatarUrl } },
          { id: `n${Date.now()}`, type: 'system', title: 'Avatar updated', body: 'Your profile now looks more trustworthy and complete.', createdAt: 'Just now', read: false }
        ),
        makeEvent('avatar_uploaded', current.profile.displayName, `Uploaded avatar ${file.name}.`)
      )));
    },
    setRole: async (role) => {
      if (!canChangeRoles(state.profile.role)) return;
      captureEvent('role_changed', { role });
      if (supabaseEnabled) {
        await repo.updateProfile({ role });
        await refreshFromSupabase();
        return;
      }
      setState((current) => withDerivedState(pushEvent(
        { ...current, profile: { ...current.profile, role } },
        makeEvent('role_changed', current.profile.displayName, `Switched demo role to ${role}.`)
      )));
    },
    setFeedMode: (mode) => setState((current) => ({ ...current, feedMode: mode })),
    setSearchQuery: (query) => setState((current) => withDerivedState({ ...current, searchQuery: query })),
    setTypingStateForGroup: (groupId, typing) => {
      setState((current) => {
        const currentPresence = current.presenceByGroup[groupId] || { onlineCount: 1, typingNames: [] };
        const myName = current.profile.displayName;
        const nextTyping = typing
          ? Array.from(new Set([...currentPresence.typingNames, myName]))
          : currentPresence.typingNames.filter((name) => name !== myName);
        return { ...current, presenceByGroup: { ...current.presenceByGroup, [groupId]: { ...currentPresence, typingNames: nextTyping } } };
      });
    },
    attachPresenceToGroup: (groupId) => {
      if (!supabaseEnabled) {
        setState((current) => ({
          ...current,
          presenceByGroup: { ...current.presenceByGroup, [groupId]: current.presenceByGroup[groupId] || { onlineCount: 1, typingNames: [] } }
        }));
        return () => {};
      }
      return createPresenceChannel(groupId, state.profile.username, (onlineCount) => {
        setState((current) => ({
          ...current,
          presenceByGroup: {
            ...current.presenceByGroup,
            [groupId]: { ...(current.presenceByGroup[groupId] || { onlineCount: 0, typingNames: [] }), onlineCount }
          }
        }));
      });
    },
    toggleInterest: async (interest) => {
      const exists = state.profile.interests.includes(interest);
      captureEvent('interest_toggled', { interest, action: exists ? 'removed' : 'added' });
      if (supabaseEnabled) {
        const next = exists ? state.profile.interests.filter((item) => item !== interest) : [...state.profile.interests, interest];
        await repo.setUserInterests(next);
        await refreshFromSupabase();
        return;
      }
      setState((current) => withDerivedState(pushEvent(
        { ...current, profile: { ...current.profile, interests: exists ? current.profile.interests.filter((item) => item !== interest) : [...current.profile.interests, interest] } },
        makeEvent('interest_toggled', current.profile.displayName, `${exists ? 'Removed' : 'Added'} ${interest}.`)
      )));
    },
    toggleJoinGroup: async (slug) => {
      const group = state.groups.find((item) => item.slug === slug);
      if (!group) return;
      if (supabaseEnabled) {
        if (group.joined) await repo.leaveGroup(group.id, group.name);
        else await repo.joinGroup(group.id, group.name);
        captureEvent(group.joined ? 'group_left' : 'group_joined', { group_slug: slug });
        await refreshFromSupabase();
        return;
      }
      const nextGroups = state.groups.map((item) => item.slug === slug ? { ...item, joined: !item.joined, memberCount: item.memberCount + (item.joined ? -1 : 1) } : item);
      const target = nextGroups.find((item) => item.slug === slug);
      captureEvent(target?.joined ? 'group_joined' : 'group_left', { group_slug: slug });
      setState((current) => withDerivedState(pushEvent(
        pushNotification(
          { ...current, groups: nextGroups },
          { id: `n${Date.now()}`, type: 'group', title: target?.joined ? `Joined ${target.name}` : `Left ${target?.name}`, body: target?.joined ? 'This group now appears in your home feed and activity loop.' : 'You can rejoin this public group any time.', createdAt: 'Just now', read: false }
        ),
        makeEvent(target?.joined ? 'group_joined' : 'group_left', current.profile.displayName, `${target?.name ?? 'Group'} membership changed.`)
      )));
    },
    createGroup: async ({ name, description, category }) => {
      const slug = slugify(name);
      captureEvent('group_created', { group_slug: slug, category });
      if (supabaseEnabled) {
        await repo.createGroup({ name, slug, description, category });
        await refreshFromSupabase();
        return;
      }
      const newGroup: Group = { id: `g${Date.now()}`, slug, name, description, category, memberCount: 1, tags: [category, 'New'], joined: true, recommendedScore: 100 };
      setState((current) => withDerivedState(pushEvent(
        pushNotification(
          { ...current, groups: [newGroup, ...current.groups] },
          { id: `n${Date.now()}`, type: 'system', title: 'Group launched', body: `${name} is live. Invite the first members and seed it with posts.`, createdAt: 'Just now', read: false }
        ),
        makeEvent('group_created', current.profile.displayName, `Created ${name}.`)
      )));
    },
    createPost: async ({ groupId, content, imageFile }) => {
      if (!content.trim() && !imageFile) return;
      let imageUrl: string | undefined;
      if (imageFile) imageUrl = await uploadImage(imageFile, 'posts');
      const group = state.groups.find((item) => item.id === groupId);
      captureEvent('post_created', { group_id: groupId, has_image: Boolean(imageUrl) });
      if (supabaseEnabled) {
        await repo.createPost({ groupId, groupName: group?.name, content: content.trim(), imageUrl });
        await refreshFromSupabase();
        return;
      }
      setState((current) => {
        const currentGroup = current.groups.find((item) => item.id === groupId);
        if (!currentGroup) return current;
        const newPost: Post = { id: `p${Date.now()}`, author: current.profile.displayName, authorUsername: current.profile.username, groupId, groupName: currentGroup.name, content: content.trim(), image: imageUrl, likes: 0, comments: 0, createdAt: 'Just now', trend: 'new', likedByMe: false, score: 0 };
        return withDerivedState(pushEvent(
          pushNotification(
            { ...current, posts: [newPost, ...current.posts] },
            { id: `n${Date.now()}`, type: 'system', title: 'Post published', body: `Your post is now live in ${currentGroup.name}.`, createdAt: 'Just now', read: false }
          ),
          makeEvent('post_created', current.profile.displayName, `Published into ${currentGroup.name}.`)
        ));
      });
    },
    createCommentOnPost: async (postId, content) => {
      if (!content.trim()) return;
      captureEvent('comment_created', { post_id: postId });
      if (supabaseEnabled) {
        await repo.createComment({ postId, content: content.trim() });
        await refreshFromSupabase();
        return;
      }
      setState((current) => withDerivedState(pushEvent(
        {
          ...current,
          comments: [...current.comments, { id: `c${Date.now()}`, postId, author: current.profile.displayName, authorUsername: current.profile.username, content: content.trim(), createdAt: 'Just now' }],
          posts: current.posts.map((post) => post.id === postId ? { ...post, comments: post.comments + 1 } : post)
        },
        makeEvent('comment_created', current.profile.displayName, `Commented on post ${postId}.`)
      )));
    },
    toggleLikeOnPost: async (postId, currentlyLiked) => {
      captureEvent(currentlyLiked ? 'post_unliked' : 'post_liked', { post_id: postId });
      if (supabaseEnabled) {
        await repo.toggleLike(postId, currentlyLiked);
        await refreshFromSupabase();
        return;
      }
      setState((current) => withDerivedState(pushEvent(
        { ...current, posts: current.posts.map((post) => post.id === postId ? { ...post, likedByMe: !currentlyLiked, likes: post.likes + (currentlyLiked ? -1 : 1) } : post) },
        makeEvent(currentlyLiked ? 'post_unliked' : 'post_liked', current.profile.displayName, `${currentlyLiked ? 'Removed like from' : 'Liked'} post ${postId}.`)
      )));
    },
    toggleFollowUser: (username) => {
      if (username === state.profile.username) return;
      setState((current) => {
        const exists = current.follows.some((item) => item.followerUsername === current.profile.username && item.followingUsername === username);
        const nextFollows: Follow[] = exists
          ? current.follows.filter((item) => !(item.followerUsername === current.profile.username && item.followingUsername === username))
          : [{ followerUsername: current.profile.username, followingUsername: username, createdAt: 'Just now' }, ...current.follows];

        return withDerivedState(pushEvent(
          pushNotification(
            { ...current, follows: nextFollows },
            {
              id: `n${Date.now()}`,
              type: 'follow',
              title: exists ? `Unfollowed @${username}` : `Now following @${username}`,
              body: exists ? 'You can follow them again any time.' : 'Posts from this person will show up in Following feed mode.',
              createdAt: 'Just now',
              read: false
            }
          ),
          makeEvent(exists ? 'user_unfollowed' : 'user_followed', current.profile.displayName, `${exists ? 'Unfollowed' : 'Followed'} ${username}.`)
        ));
      });
      captureEvent('follow_toggled', { username });
    },
    createInviteLink: (groupId) => {
      const group = state.groups.find((item) => item.id === groupId);
      if (!group) return;
      const invite: Invite = {
        id: `invite-${Date.now()}`,
        groupId,
        groupName: group.name,
        code: makeInviteCode(group.name),
        createdAt: 'Just now',
        acceptedCount: 0
      };
      setState((current) => withDerivedState(pushEvent(
        pushNotification(
          { ...current, invites: [invite, ...current.invites] },
          { id: `n${Date.now()}`, type: 'invite', title: 'Invite link created', body: `New invite link ready for ${group.name}.`, createdAt: 'Just now', read: false }
        ),
        makeEvent('invite_created', current.profile.displayName, `Created invite link for ${group.name}.`)
      )));
      captureEvent('invite_created', { group_id: groupId });
    },
    acceptInviteCode: (code) => {
      const invite = state.invites.find((item) => item.code.trim().toLowerCase() === code.trim().toLowerCase());
      if (!invite) return;
      setState((current) => {
        const nextInvites = current.invites.map((item) =>
          item.id === invite.id ? { ...item, acceptedCount: item.acceptedCount + 1 } : item
        );
        const nextGroups = current.groups.map((group) =>
          group.id === invite.groupId ? { ...group, joined: true, memberCount: group.memberCount + 1 } : group
        );
        return withDerivedState(pushEvent(
          pushNotification(
            { ...current, invites: nextInvites, groups: nextGroups },
            { id: `n${Date.now()}`, type: 'invite', title: 'Invite accepted', body: `You joined ${invite.groupName}.`, createdAt: 'Just now', read: false }
          ),
          makeEvent('invite_accepted', current.profile.displayName, `Accepted invite for ${invite.groupName}.`)
        ));
      });
      captureEvent('invite_accepted', { code: invite.code });
    },
    sendMessage: async (groupId, content, imageFile) => {
      if (!content.trim() && !imageFile) return;
      let imageUrl: string | undefined;
      if (imageFile) imageUrl = await uploadImage(imageFile, 'chat');
      const group = state.groups.find((item) => item.id === groupId);
      captureEvent('message_sent', { group_id: groupId, has_image: Boolean(imageUrl) });
      if (supabaseEnabled) {
        await repo.createMessage({ groupId, groupName: group?.name, content: content.trim(), imageUrl });
        await loadGroupMessages(groupId);
        await refreshFromSupabase();
        return;
      }
      setState((current) => withDerivedState(pushEvent(
        { ...current, messages: [...current.messages, { id: `m${Date.now()}`, groupId, author: current.profile.displayName, content: content.trim(), image: imageUrl, createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }] },
        makeEvent('message_sent', current.profile.displayName, `Sent a message in ${group?.name ?? 'group'}.`)
      )));
    },
    markAllNotificationsRead: async () => {
      captureEvent('notifications_cleared');
      if (supabaseEnabled) {
        await repo.markAllNotificationsRead();
        await refreshFromSupabase();
        return;
      }
      setState((current) => withDerivedState(pushEvent(
        { ...current, notifications: current.notifications.map((item) => ({ ...item, read: true })) },
        makeEvent('notifications_cleared', current.profile.displayName, 'Marked notifications as read.')
      )));
    },
    createReport: async ({ targetType, targetId, reason }) => {
      captureEvent('report_created', { target_type: targetType });
      if (supabaseEnabled) {
        await repo.createReport({ targetType, targetId, reason });
        await refreshFromSupabase();
        return;
      }
      const report: ReportItem = { id: `r${Date.now()}`, targetType, targetId, reason, createdAt: 'Just now', status: 'open' };
      setState((current) => withDerivedState(pushEvent(
        pushNotification(
          { ...current, reports: [report, ...current.reports] },
          { id: `n${Date.now()}`, type: 'moderation', title: 'New moderation case', body: `${targetType} report created for review.`, createdAt: 'Just now', read: false }
        ),
        makeEvent('report_created', current.profile.displayName, `Opened a ${targetType} report.`)
      )));
    },
    resolveReport: async (reportId) => {
      if (!canResolveReports(state.profile.role)) return;
      captureEvent('report_resolved', { report_id: reportId });
      if (supabaseEnabled) {
        await repo.resolveReport(reportId);
        await refreshFromSupabase();
        return;
      }
      setState((current) => withDerivedState(pushEvent(
        { ...current, reports: current.reports.map((item) => item.id === reportId ? { ...item, status: 'resolved' } : item) },
        makeEvent('report_resolved', current.profile.displayName, `Resolved report ${reportId}.`)
      )));
    },
    loadGroupMessages
  }), [state, hydrated, syncing, analytics]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error('useStore must be used within StoreProvider');
  return value;
}
