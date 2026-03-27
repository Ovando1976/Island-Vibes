'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, Compass, Home, MapPinned, Route } from 'lucide-react';

import { cn } from '@/lib/utils';

const items = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/transit', label: 'Transit', icon: Route },
  { href: '/events', label: 'Events', icon: CalendarDays },
  { href: '/trip', label: 'Trip', icon: MapPinned },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto grid max-w-3xl grid-cols-5 px-2 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-xs transition',
                active ? 'bg-cyan-400/15 text-cyan-200' : 'text-slate-400 hover:bg-white/5 hover:text-white',
              )}
            >
              <Icon className="mb-1 h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
