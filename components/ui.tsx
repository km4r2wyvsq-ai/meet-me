import { ReactNode } from 'react';
import clsx from 'clsx';

export function cn(...values: Array<string | undefined | false | null>) {
  return clsx(values);
}

export function Button({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn('rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50', className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('rounded-3xl border bg-white p-5 shadow-card', className)}>{children}</div>;
}

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand', className)}>{children}</span>;
}
