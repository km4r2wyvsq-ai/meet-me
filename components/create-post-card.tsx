'use client';

import { useMemo, useState } from 'react';
import { Button, Card } from '@/components/ui';
import { useStore } from '@/lib/store';
import { ImagePicker } from '@/components/image-picker';

export function CreatePostCard() {
  const { state, createPost } = useStore();
  const joinedGroups = useMemo(() => state.groups.filter((group) => group.joined), [state.groups]);
  const [groupId, setGroupId] = useState(joinedGroups[0]?.id ?? '');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <Card className="space-y-4">
      <div className="text-lg font-semibold text-ink">Share something with your communities</div>
      <select value={groupId} onChange={(event) => setGroupId(event.target.value)}>
        {joinedGroups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}
      </select>
      <textarea rows={4} value={content} onChange={(event) => setContent(event.target.value)} placeholder="What do you want to talk about?" />
      <ImagePicker label="Add post image" onChange={(file) => setImageFile(file)} />
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-slate-500">In demo mode images are stored locally as data URLs. In Supabase mode they upload to Storage.</div>
        <Button
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await createPost({ groupId, content, imageFile });
              setContent('');
              setImageFile(null);
            } finally {
              setBusy(false);
            }
          }}
        >
          Create post
        </Button>
      </div>
    </Card>
  );
}
