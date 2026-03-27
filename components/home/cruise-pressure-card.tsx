import { Waves } from 'lucide-react';

import { Card } from '@/components/ui/card';

export function CruisePressureCard({ shipsInPort, passengerEstimate }: { shipsInPort: number; passengerEstimate: number }) {
  const pressure = passengerEstimate >= 5000 ? 'Heavy' : passengerEstimate >= 2500 ? 'Moderate' : 'Light';

  return (
    <Card>
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-fuchsia-400/10 p-3 text-fuchsia-200">
          <Waves className="h-5 w-5" />
        </div>

        <div className="flex-1">
          <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Cruise pressure</div>
          <div className="mt-1 text-lg font-semibold">{pressure} traffic</div>
          <p className="mt-2 text-sm text-slate-300">
            {shipsInPort} ships in port, estimated {passengerEstimate.toLocaleString()} passengers today.
          </p>
        </div>
      </div>
    </Card>
  );
}
