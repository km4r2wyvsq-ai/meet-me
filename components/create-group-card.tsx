'use client';

import { useState } from 'react';
import { Button, Card } from '@/components/ui';
import { useStore } from '@/lib/store';

export function CreateGroupCard() {
  const { createGroup } = useStore();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Community');
  const [description, setDescription] = useState('');

  return (
    <Card className="space-y-4">
      <div>
        <div className="text-lg font-semibold text-ink">Launch a new group</div>
        <p className="mt-1 text-sm text-slate-500">Start with a focused niche and one clear recurring activity.</p>
      </div>
      <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Group name" />
      <input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
      <textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What is this community about?" />
      <Button onClick={() => {
        if (!name.trim() || !description.trim()) return;
        createGroup({ name, description, category });
        setName('');
        setCategory('Community');
        setDescription('');
      }}>Create group</Button>
    </Card>
  );
}
