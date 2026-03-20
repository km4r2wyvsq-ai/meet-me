import type { Follow, Invite } from '@/lib/types';
import { supabaseEnabled } from '@/lib/supabase/client';
import * as network from '@/lib/supabase/network';

export async function loadNetworkState(): Promise<{ follows: Follow[]; invites: Invite[] }> {
  if (!supabaseEnabled) return { follows: [], invites: [] };

  const [follows, invites] = await Promise.all([
    network.getFollows(),
    network.getInvites(),
  ]);

  return { follows, invites };
}

export async function toggleFollow(username: string) {
  if (!supabaseEnabled) return null;
  return network.toggleFollow(username);
}

export async function createInvite(groupId: string) {
  if (!supabaseEnabled) return null;
  return network.createInvite(groupId);
}

export async function acceptInvite(code: string) {
  if (!supabaseEnabled) return null;
  return network.acceptInvite(code);
}
