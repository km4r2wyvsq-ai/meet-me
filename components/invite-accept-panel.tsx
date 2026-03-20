'use client';

import { useState } from 'react';
import { Ticket } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { useStore } from '@/lib/store';

export function InviteAcceptPanel() {
  const { acceptInviteCode } = useStore();
  const [code, setCode] = useState('');

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2">
        <Ticket size={18} />
        <div className="text-lg font-semibold text-ink">Accept invite</div>
      </div>
      <input
        value={code}
        onChange={(event) => setCode(event.target.value)}
        placeholder="Paste invite code"
      />
      <Button
        onClick={() => {
          acceptInviteCode(code);
          setCode('');
        }}
      >
        Join with code
      </Button>
    </Card>
  );
}
