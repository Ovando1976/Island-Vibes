import { ShipWheel } from 'lucide-react';

import { Card } from '@/components/ui/card';

export function FerryAlertCard({ label, minutes, route }: { label: string; minutes: number | null; route: string }) {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-200">
          <ShipWheel className="h-5 w-5" />
        </div>

        <div className="flex-1">
          <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Ferry alert</div>
          <div className="mt-1 text-lg font-semibold">{label}</div>
          <p className="mt-2 text-sm text-slate-300">{route}</p>
          <div className="mt-3 text-sm text-cyan-200">
            {minutes !== null ? `${minutes} min until departure` : 'No active departure found'}
          </div>
        </div>
      </div>
    </Card>
  );
}
