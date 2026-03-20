'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { useStore } from '@/lib/store';
import { supabaseEnabled } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();
  const [email, setEmail] = useState('demo@meetme.app');
  const [password, setPassword] = useState('password123');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center p-6">
      <Card className="w-full space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">
            {supabaseEnabled ? 'Sign in with your real account.' : 'Use any email to enter the working demo.'}
          </p>
        </div>
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" type="email" />
        <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" type="password" />
        {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
        <Button
          className="w-full"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setError('');
            try {
              await login(email, password);
              router.push('/home');
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Could not log in.');
            } finally {
              setBusy(false);
            }
          }}
        >
          Log in
        </Button>
        <p className="text-sm text-slate-500">No account yet? <Link className="text-brand" href="/signup">Create one</Link></p>
      </Card>
    </div>
  );
}
