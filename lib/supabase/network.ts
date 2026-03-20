import { supabase, supabaseEnabled } from '@/lib/supabase/client';

function requireClient() {
  if (!supabaseEnabled || !supabase) {
    throw new Error('Supabase is not enabled.');
  }
  return supabase;
}

export async function acceptInvite(inviteId: string) {
  const client = requireClient();

  const { data: invite, error } = await client
    .from('invites')
    .select(`
      id,
      group_id,
      created_by,
      groups (
        name
      )
    `)
    .eq('id', inviteId)
    .single();

  if (error || !invite) {
    throw new Error('Invite not found');
  }

  const groupName = invite.groups?.[0]?.name ?? 'a group';

  // Add membership
  const { error: memberError } = await client.from('group_members').insert({
    group_id: invite.group_id,
    profile_id: invite.created_by,
    role: 'member'
  });

  if (memberError) {
    throw memberError;
  }

  // Create notification for user
  await client.from('notifications').insert({
    profile_id: invite.created_by,
    type: 'invite',
    title: 'Invite accepted',
    body: `You joined ${groupName}.`
  });

  // Create notification for inviter
  await client.from('notifications').insert({
    profile_id: invite.created_by,
    type: 'invite',
    title: 'Invite used',
    body: `Someone joined ${groupName} using your invite link.`
  });

  // Analytics event
  await client.from('analytics_events').insert({
    event_name: 'invite_accepted',
    event_detail: `Accepted invite for ${groupName}.`
  });

  // Mark invite as used
  await client
    .from('invites')
    .update({ state: 'accepted' })
    .eq('id', inviteId);

  return { success: true };
}
