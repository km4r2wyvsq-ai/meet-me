import type { AnalyticsEvent, NotificationItem } from '@/lib/types';

export type ActivityFeedItem = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  kind: 'event' | 'notification';
};

export function buildActivityFeed(events: AnalyticsEvent[], notifications: NotificationItem[]): ActivityFeedItem[] {
  const eventItems: ActivityFeedItem[] = events.map((event) => ({
    id: `event-${event.id}`,
    title: event.name.replace(/_/g, ' '),
    body: event.detail,
    createdAt: event.createdAt,
    kind: 'event'
  }));

  const notificationItems: ActivityFeedItem[] = notifications.map((notification) => ({
    id: `notification-${notification.id}`,
    title: notification.title,
    body: notification.body,
    createdAt: notification.createdAt,
    kind: 'notification'
  }));

  return [...notificationItems, ...eventItems]
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    .slice(0, 30);
}
