'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Compass, Home, MessageSquare, Settings, Shield, UserCircle2, Activity, BarChart3, Rocket, ClipboardCheck, HeartPulse, Wrench, MessageSquareWarning, ChartNoAxesColumn, UsersRound, Flag, UserRoundCheck, BadgePlus, LineChart } from 'lucide-react';
import { cn } from '@/components/ui';
import { useStore } from '@/lib/store';

export function Navbar() {
  const pathname = usePathname();
  const { analytics, state } = useStore();

  const navItems = [
    { href: '/home', label: 'Home', icon: Home },
    { href: '/discover', label: 'Discover', icon: Compass },
    { href: '/activity', label: 'Activity', icon: Activity },
    { href: '/creator', label: 'Creator', icon: BarChart3 },
    { href: '/launch-dashboard', label: 'Launch', icon: Rocket },
    { href: '/qa', label: 'QA', icon: ClipboardCheck },
    { href: '/status', label: 'Status', icon: HeartPulse },
    { href: '/release-ops', label: 'Release', icon: Wrench },
    { href: '/feedback', label: 'Feedback', icon: MessageSquareWarning },
    { href: '/admin/feedback-analytics', label: 'Feedback data', icon: ChartNoAxesColumn },
    { href: '/admin/alpha-users', label: 'Alpha users', icon: UsersRound },
    { href: '/admin/alpha-plan', label: 'Alpha plan', icon: Flag },
    { href: '/admin/alpha-access', label: 'Alpha access', icon: UserRoundCheck },
    { href: '/admin/beta-invites', label: 'Beta invites', icon: BadgePlus },
    { href: '/admin/onboarding-metrics', label: 'Onboarding', icon: LineChart },
    { href: '/notifications', label: 'Alerts', icon: Bell },
    { href: '/groups/build-in-public/chat', label: 'Chat', icon: MessageSquare },
    { href: `/profile/${state.profile.username}`, label: 'Profile', icon: UserCircle2 },
    ...((state.profile.role === 'admin' || state.profile.role === 'moderator') ? [{ href: '/admin', label: 'Admin', icon: Shield }] : []),
    { href: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r bg-white/90 p-6 backdrop-blur lg:block">
        <Link href="/home" className="mb-8 block text-2xl font-bold tracking-tight text-ink">Meet me</Link>
        <p className="mb-2 text-sm text-slate-500">Find your people through shared interests.</p>
        <div className="mb-6 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Role: <span className="font-semibold text-ink">{state.profile.role}</span>
        </div>
        <nav className="space-y-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname?.startsWith(`${href}/`);
            return (
              <Link key={href} href={href} className={cn('flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900', active && 'bg-brand-soft text-brand')}>
                <span className="flex items-center gap-3">
                  <Icon size={18} />
                  <span className="font-medium">{label}</span>
                </span>
                {href === '/notifications' && analytics.notificationsUnread > 0 ? (
                  <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-semibold text-white">{analytics.notificationsUnread}</span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </aside>
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-around">
          {navItems.slice(0, 5).map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname?.startsWith(`${href}/`);
            return (
              <Link key={href} href={href} className={cn('relative flex flex-col items-center gap-1 rounded-xl px-2 py-1 text-xs text-slate-500', active && 'text-brand')}>
                <Icon size={18} />
                {label}
                {href === '/notifications' && analytics.notificationsUnread > 0 ? (
                  <span className="absolute -right-1 top-0 rounded-full bg-brand px-1.5 text-[10px] font-semibold text-white">{analytics.notificationsUnread}</span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
