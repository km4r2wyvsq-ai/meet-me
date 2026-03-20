import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center p-6">
      <div className="w-full rounded-3xl border bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-bold text-ink">Page not found</h1>
        <p className="mt-3 text-slate-600">The page you tried to open does not exist or is not available in this build.</p>
        <Link href="/home" className="mt-6 inline-flex rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white">
          Go home
        </Link>
      </div>
    </div>
  );
}
