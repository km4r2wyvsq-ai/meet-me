'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { useStore } from '@/lib/store';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useStore();
  const [email, setEmail] = useState('founder@meetme.app');
  const [username, setUsername] = useState('Founder Demo');
  const [password, setPassword] = useState('password123');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center p-6">
      <Card className="w-full space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500">Join communities built around your interests.</p>
        </div>
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" type="email" />
        <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Username" />
        <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" type="password" />
        {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
        <Button
          className="w-full"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setError('');
            try {
              await signup(email, username, password);
              router.push('/onboarding');
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Could not sign up.');
            } finally {
              setBusy(false);
            }
          }}
        >
          Continue
        </Button>
        <p className="text-sm text-slate-500">Already have an account? <Link className="text-brand" href="/login">Log in</Link></p>
      </Card>
    </div>
  );
}
