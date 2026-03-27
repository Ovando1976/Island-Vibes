import type { ReactNode } from 'react';

import { BottomNav } from '@/components/bottom-nav';

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function AppShell({ title, subtitle, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/85 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-300/80">USVI Live</p>
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              {subtitle ? <p className="mt-1 text-sm text-slate-300">{subtitle}</p> : null}
            </div>

            <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
              Live island mode
            </div>
          </div>
        </header>

        <main className="flex-1 pb-24">{children}</main>

        <BottomNav />
      </div>
    </div>
  );
}
