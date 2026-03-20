'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button, Card } from '@/components/ui';
import { useStore } from '@/lib/store';
import { ImagePicker } from '@/components/image-picker';

export function ChatPanel({ groupId }: { groupId: string }) {
  const { state, sendMessage, setTypingStateForGroup } = useStore();
  const [value, setValue] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const messages = useMemo(() => state.messages.filter((message) => message.groupId === groupId), [state.messages, groupId]);
  const presence = state.presenceByGroup[groupId] || { onlineCount: 0, typingNames: [] };

  useEffect(() => {
    if (value.trim()) setTypingStateForGroup(groupId, true);
    else setTypingStateForGroup(groupId, false);
    return () => setTypingStateForGroup(groupId, false);
  }, [value, groupId, setTypingStateForGroup]);

  return (
    <Card className="flex h-[70vh] flex-col">
      <div className="mb-4 border-b pb-4">
        <div className="text-lg font-semibold text-ink">Group chat</div>
        <div className="text-sm text-slate-500">Text and image chat now support typing and presence state in the app layer.</div>
        <div className="mt-2 text-xs text-slate-400">
          {presence.onlineCount} online {presence.typingNames.length ? `· ${presence.typingNames.join(', ')} typing...` : ''}
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.map((message) => (
          <div key={message.id} className="rounded-2xl bg-slate-50 p-3">
            <div className="mb-1 text-sm font-semibold text-ink">{message.author}</div>
            {message.content ? <div className="text-sm text-slate-700">{message.content}</div> : null}
            {message.image ? <img src={message.image} alt="Chat attachment" className="mt-3 max-h-64 w-full rounded-2xl object-cover" /> : null}
            <div className="mt-1 text-xs text-slate-400">{message.createdAt}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 border-t pt-4">
        <ImagePicker label="Attach image" onChange={(file) => setImageFile(file)} />
        <form
          className="mt-3 flex gap-3"
          onSubmit={async (event) => {
            event.preventDefault();
            setBusy(true);
            try {
              await sendMessage(groupId, value, imageFile);
              setValue('');
              setImageFile(null);
              setTypingStateForGroup(groupId, false);
            } finally {
              setBusy(false);
            }
          }}
        >
          <input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Write a message..." />
          <Button type="submit" disabled={busy}>Send</Button>
        </form>
      </div>
    </Card>
  );
}
