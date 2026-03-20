export type NotificationItem = {
  id: string;
  type: 'like' | 'comment' | 'group' | 'system' | 'moderation' | 'invite' | 'follow';
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};

export type ReportItem = {
  id: string;
  targetType: 'post' | 'message' | 'group' | 'user';
  targetId: string;
  reason: string;
  createdAt: string;
  status: 'open' | 'reviewed' | 'resolved';
};

export type Analytics = {
  joinedGroups: number;
  postsCreated: number;
  messagesSent: number;
  profileCompletion: number;
  notificationsUnread: number;
};

export type AnalyticsEvent = {
  id: string;
  name: string;
  actor: string;
  detail: string;
  createdAt: string;
};

export type Role = 'member' | 'moderator' | 'admin';
export type FeedMode = 'for-you' | 'following';

export type Comment = {
  id: string;
  postId: string;
  author: string;
  authorUsername: string;
  content: string;
  createdAt: string;
};

export type Group = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  memberCount: number;
  tags: string[];
  joined?: boolean;
  recommendedScore?: number;
};

export type Post = {
  id: string;
  author: string;
  authorUsername: string;
  groupId: string;
  groupName: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  createdAt: string;
  trend?: 'hot' | 'new' | 'rising';
  likedByMe?: boolean;
  score?: number;
};

export type Message = {
  id: string;
  groupId: string;
  author: string;
  content: string;
  image?: string;
  createdAt: string;
};

export type PresenceState = {
  onlineCount: number;
  typingNames: string[];
};

export type SearchResult = {
  id: string;
  kind: 'group' | 'post' | 'user';
  title: string;
  subtitle: string;
  href: string;
};

export type Invite = {
  id: string;
  groupId: string;
  groupName: string;
  code: string;
  createdAt: string;
  acceptedCount: number;
};

export type RecommendationBundle = {
  groups: Group[];
  posts: Post[];
};

export type Follow = {
  followerUsername: string;
  followingUsername: string;
  createdAt: string;
};

export type UserDirectoryProfile = {
  username: string;
  displayName: string;
  bio: string;
};

export type UserProfile = {
  email: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl?: string;
  role: Role;
  interests: string[];
};

export type AppState = {
  authenticated: boolean;
  profile: UserProfile;
  groups: Group[];
  posts: Post[];
  comments: Comment[];
  messages: Message[];
  notifications: NotificationItem[];
  reports: ReportItem[];
  analyticsEvents: AnalyticsEvent[];
  searchQuery: string;
  searchResults: SearchResult[];
  presenceByGroup: Record<string, PresenceState>;
  invites: Invite[];
  recommendations: RecommendationBundle;
  follows: Follow[];
  feedMode: FeedMode;
  networkMode: 'demo' | 'supabase';
};


export type FeedbackCategory = 'bug' | 'idea' | 'ux' | 'performance' | 'other';
export type FeedbackStatus = 'new' | 'reviewed' | 'planned' | 'closed';

export type FeedbackItem = {
  id: string;
  category: FeedbackCategory;
  message: string;
  page: string;
  status: FeedbackStatus;
  createdAt: string;
  email?: string;
};


export type AlphaAccessState = 'pending' | 'approved' | 'revoked';
export type WaitlistStatus = 'new' | 'reviewed' | 'invited' | 'closed';

export type AlphaAccessItem = {
  id: string;
  email: string;
  accessState: AlphaAccessState;
  inviteCode?: string;
  note?: string;
  createdAt: string;
};

export type WaitlistRequestItem = {
  id: string;
  email: string;
  name: string;
  context: string;
  status: WaitlistStatus;
  createdAt: string;
};
