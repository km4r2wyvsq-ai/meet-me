import { AppState } from '@/lib/types';

export const initialState: AppState = {
  authenticated: true,
  profile: {
    email: 'demo@meetme.app',
    username: 'demo-user',
    displayName: 'Demo User',
    bio: 'Building warmer communities on the internet.',
    avatarUrl: '',
    role: 'admin',
    interests: ['Photography', 'Travel', 'Startups']
  },
  groups: [
    {
      id: 'g1',
      name: 'City Walkers',
      slug: 'city-walkers',
      description: 'Urban routes, street photography, local tips, and community challenges.',
      category: 'Photography',
      memberCount: 1284,
      tags: ['Photography', 'Travel', 'Local'],
      joined: true,
      recommendedScore: 92
    },
    {
      id: 'g2',
      name: 'Build in Public',
      slug: 'build-in-public',
      description: 'Founders and makers sharing weekly progress, experiments, and honest lessons.',
      category: 'Startups',
      memberCount: 845,
      tags: ['Tech', 'Startups', 'Creators'],
      joined: true,
      recommendedScore: 97
    },
    {
      id: 'g3',
      name: 'Weekend Recipes',
      slug: 'weekend-recipes',
      description: 'Text-first recipe swaps with photo drops, meal prep ideas, and cooking threads.',
      category: 'Food',
      memberCount: 632,
      tags: ['Food', 'Lifestyle'],
      joined: false,
      recommendedScore: 61
    }
  ],
  posts: [
    {
      id: 'p1',
      author: 'Lina Brooks',
      authorUsername: 'linab',
      groupId: 'g1',
      groupName: 'City Walkers',
      content: 'Best hidden street in Berlin for photo walks? Looking for places with good evening light and fewer crowds.',
      likes: 42,
      comments: 2,
      createdAt: '2h ago',
      trend: 'hot',
      likedByMe: false,
      score: 89
    },
    {
      id: 'p2',
      author: 'Dev Shah',
      authorUsername: 'devshah',
      groupId: 'g2',
      groupName: 'Build in Public',
      content: 'We shipped a cleaner onboarding flow today. What makes you trust a new community app enough to sign up and stay?',
      likes: 88,
      comments: 1,
      createdAt: '5h ago',
      image: 'gradient-card',
      trend: 'rising',
      likedByMe: false,
      score: 96
    },
    {
      id: 'p3',
      author: 'Ava Chen',
      authorUsername: 'ava',
      groupId: 'g1',
      groupName: 'City Walkers',
      content: 'My favorite rule for community walks: one route, one constraint, one story to share afterward.',
      likes: 31,
      comments: 4,
      createdAt: '8h ago',
      trend: 'new',
      likedByMe: false,
      score: 74
    }
  ],
  comments: [
    {
      id: 'c1',
      postId: 'p1',
      author: 'Ava Chen',
      authorUsername: 'ava',
      content: 'Try Kreuzberg around sunset. Great reflections after light rain.',
      createdAt: '1h ago'
    },
    {
      id: 'c2',
      postId: 'p1',
      author: 'Noah Park',
      authorUsername: 'noah',
      content: 'Seconding Kreuzberg. Also check side streets near Gorlitzer Park.',
      createdAt: '45m ago'
    },
    {
      id: 'c3',
      postId: 'p2',
      author: 'Marta Flores',
      authorUsername: 'martaf',
      content: 'Fastest trust signal for me is seeing real group activity in the first minute.',
      createdAt: '3h ago'
    }
  ],
  messages: [
    { id: 'm1', groupId: 'g1', author: 'Ava', content: 'Anyone up for a Sunday street-photo challenge?', createdAt: '10:02' },
    { id: 'm2', groupId: 'g1', author: 'Noah', content: 'Yes. Maybe one frame, one sentence, one lesson.', createdAt: '10:03' },
    { id: 'm3', groupId: 'g2', author: 'Mia', content: 'Posting my onboarding teardown in five minutes.', createdAt: '11:14' }
  ],
  notifications: [
    {
      id: 'n1',
      type: 'group',
      title: 'New activity in Build in Public',
      body: 'Three new posts landed in one of your joined communities.',
      createdAt: '1h ago',
      read: false
    },
    {
      id: 'n2',
      type: 'system',
      title: 'Complete your profile',
      body: 'Add an avatar and bio to improve trust and conversion.',
      createdAt: '1d ago',
      read: false
    }
  ],
  reports: [],
  analyticsEvents: [
    {
      id: 'e1',
      name: 'session_started',
      actor: 'Demo User',
      detail: 'Opened the startup demo experience.',
      createdAt: 'Today'
    }
  ],
  searchQuery: '',
  searchResults: [],
  presenceByGroup: {
    g1: { onlineCount: 18, typingNames: ['Ava'] },
    g2: { onlineCount: 33, typingNames: ['Mia', 'Leo'] },
    g3: { onlineCount: 7, typingNames: [] }
  },
  invites: [
    {
      id: 'i1',
      groupId: 'g2',
      groupName: 'Build in Public',
      code: 'BIP-FOUNDERS-24',
      createdAt: 'Today',
      acceptedCount: 4
    }
  ],
  recommendations: {
    groups: [],
    posts: []
  },
  follows: [
    { followerUsername: 'demo-user', followingUsername: 'devshah', createdAt: 'Today' },
    { followerUsername: 'demo-user', followingUsername: 'ava', createdAt: 'Today' }
  ],
  feedMode: 'for-you',
  networkMode: 'demo'
};
