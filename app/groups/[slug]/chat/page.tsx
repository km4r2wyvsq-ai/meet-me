import { GroupChatPageClient } from '@/components/group-chat-page-client';

export default async function GroupChatPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <GroupChatPageClient slug={slug} />;
}
