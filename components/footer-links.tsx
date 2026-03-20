import Link from 'next/link';

export function FooterLinks() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
      <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
      <Link href="/terms" className="hover:text-slate-900">Terms</Link>
      <Link href="/help" className="hover:text-slate-900">Help</Link>
      <Link href="/launch-dashboard" className="hover:text-slate-900">Launch</Link>
      <Link href="/qa" className="hover:text-slate-900">QA</Link>
      <Link href="/status" className="hover:text-slate-900">Status</Link>
      <Link href="/feedback" className="hover:text-slate-900">Feedback</Link>
      <Link href="/release-notes" className="hover:text-slate-900">Release notes</Link>
      <Link href="/admin/onboarding-metrics" className="hover:text-slate-900">Onboarding</Link>
      <Link href="/alpha-welcome" className="hover:text-slate-900">Alpha welcome</Link>
      <Link href="/waitlist" className="hover:text-slate-900">Waitlist</Link>
    </div>
  );
}
