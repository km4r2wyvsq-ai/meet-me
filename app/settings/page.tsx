'use client';

import { useEffect, useState } from 'react';
import { Button, Card } from '@/components/ui';
import { useStore } from '@/lib/store';
import { ImagePicker } from '@/components/image-picker';

export default function SettingsPage() {
  const { state, updateProfile, updateAvatar, logout } = useStore();
  const [displayName, setDisplayName] = useState(state.profile.displayName);
  const [bio, setBio] = useState(state.profile.bio);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setDisplayName(state.profile.displayName);
    setBio(state.profile.bio);
  }, [state.profile.displayName, state.profile.bio]);

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6 md:p-8">
      <Card className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-ink">Settings</h1>
          <p className="mt-2 text-slate-500">Update your profile and keep the same UI in demo mode or Supabase mode.</p>
        </div>
        {state.profile.avatarUrl ? (
          <img src={state.profile.avatarUrl} alt="Avatar" className="h-24 w-24 rounded-full object-cover" />
        ) : null}
        <ImagePicker label="Upload avatar" onChange={(file) => setAvatarFile(file)} />
        <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Display name" />
        <textarea rows={4} value={bio} onChange={(event) => setBio(event.target.value)} placeholder="Bio" />
        <div className="flex flex-wrap gap-3">
          <Button
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await updateProfile({ displayName, bio });
                if (avatarFile) await updateAvatar(avatarFile);
                setAvatarFile(null);
              } finally {
                setBusy(false);
              }
            }}
          >
            Save changes
          </Button>
          <Button
            className="bg-slate-900"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await logout();
              } finally {
                setBusy(false);
              }
            }}
          >
            Log out
          </Button>
        </div>
      </Card>
    </div>
  );
}
