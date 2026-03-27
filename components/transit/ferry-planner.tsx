import { Card } from '@/components/ui/card';
import { getNextFerryDeparture, minutesUntil } from '@/lib/transit/next-ferry';
import type { FerryDepartureRecord, FerryRouteKey } from '@/lib/types';
import { formatTime } from '@/lib/utils';

type Props = {
  departures: FerryDepartureRecord[];
  routeKey: FerryRouteKey;
  title: string;
};

export function FerryPlanner({ departures, routeKey, title }: Props) {
  const next = getNextFerryDeparture(departures, routeKey);
  const minutes = next ? minutesUntil(next.departureDate) : null;

  return (
    <Card className="space-y-4">
      <div>
        <div className="text-lg font-semibold">{title}</div>
        <p className="mt-1 text-sm text-slate-300">The app should make island movement feel obvious.</p>
      </div>

      {next ? (
        <>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Next departure</div>
            <div className="mt-2 text-2xl font-bold">{formatTime(next.departureDate)}</div>
            <div className="mt-2 text-sm text-slate-300">
              {next.departFrom} → {next.arriveAt}
            </div>
            <div className="mt-3 text-sm text-cyan-200">{minutes} min until departure</div>
          </div>

          <div className="text-sm text-slate-300">
            Allow about {next.travelMinutes ?? 20} minutes on the water and add local transfer buffer time in busy
            periods.
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          No active departure available for this route.
        </div>
      )}
    </Card>
  );
}
