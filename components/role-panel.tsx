'use client';

import { ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui';
import { Role } from '@/lib/types';
import { useStore } from '@/lib/store';
import { canChangeRoles } from '@/lib/permissions';

const roles: Role[] = ['member', 'moderator', 'admin'];

export function RolePanel() {
  const { state, setRole } = useStore();
  const allowed = canChangeRoles(state.profile.role);

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck size={18} />
        <div className="text-lg font-semibold text-ink">Role controls</div>
      </div>
      <p className="text-sm text-slate-600">Demo role switching now mirrors the future production permission model. Only admins can change roles from this screen.</p>
      <div className="flex flex-wrap gap-3">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => setRole(role)}
            disabled={!allowed}
            className={state.profile.role === role
              ? 'rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white'
              : 'rounded-2xl border px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50'}
          >
            {role}
          </button>
        ))}
      </div>
      <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
        Current role: <span className="font-semibold text-ink">{state.profile.role}</span>
      </div>
    </Card>
  );
}
