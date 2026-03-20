import { Role } from '@/lib/types';

export function canAccessAdmin(role: Role) {
  return role === 'admin' || role === 'moderator';
}

export function canResolveReports(role: Role) {
  return role === 'admin' || role === 'moderator';
}

export function canChangeRoles(role: Role) {
  return role === 'admin';
}

export function canCreateGroups(role: Role) {
  return role === 'admin' || role === 'moderator' || role === 'member';
}
