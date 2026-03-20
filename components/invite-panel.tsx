'use client';

import { useMemo, useState } from 'react';
import { Link2 } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { useStore } from '@/lib/store';

export function InvitePanel() {
  const { state, createInviteLink } = useStore();
  const joinedGroups = useMemo(() => state.groups.filter((group) => group.joined), [state.groups]);
  const [groupId, setGroupId] = useState(joinedGroups[0]?.id ?? '');
  const activeInvites = useMemo(() => state.invites.filter((invite) => joinedGroups.some((group) => group.id === invite.groupId)), [state.invites, joinedGroups]);

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2">
        <Link2 size={18} />
        <div className="text-lg font-semibold text-ink">Invite links</div>
      </div>

      <select value={groupId} onChange={(event) => setGroupId(event.target.value)}>
        {joinedGroups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}
      </select>

      <Button onClick={() => createInviteLink(groupId)}>Create invite link</Button>

      <div className="space-y-3">
        {activeInvites.length ? activeInvites.map((invite) => (
          <div key={invite.id} className="rounded-2xl border p-4">
            <div className="font-semibold text-ink">{invite.groupName}</div>
            <div className="mt-1 text-sm text-slate-500">{invite.code}</div>
            <div className="mt-2 text-xs text-slate-400">{invite.acceptedCount} accepted · {invite.createdAt}</div>
          </div>
        )) : <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No invite links yet.</div>}
      </div>
    </Card>
  );
}
