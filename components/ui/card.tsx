import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-sm',
        className,
      )}
    >
      {children}
    </div>
  );
}
