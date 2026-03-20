import Link from 'next/link';
import { getFeatureFlags } from '@/lib/feature-flags';

export function AlphaBanner() {
  const flags = getFeatureFlags();
  if (!flags.alphaBanner) return null;

  return (
    <div className="border-b bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <div>
          Meet me is in closed alpha. Expect quick iteration, product changes, and active feedback collection.
        </div>
        <div className="flex items-center gap-4">
          <Link href="/feedback" className="font-semibold underline-offset-2 hover:underline">
            Send feedback
          </Link>
          <Link href="/status" className="font-semibold underline-offset-2 hover:underline">
            Status
          </Link>
        </div>
      </div>
    </div>
  );
}
