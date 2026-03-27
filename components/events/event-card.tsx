import { CalendarDays, MapPin } from 'lucide-react';

import { Card } from '@/components/ui/card';
import type { EventRecord } from '@/lib/types';

export function EventCard({ event }: { event: EventRecord }) {
  const starts = new Date(event.startsAt);

  return (
    <Card className="h-full">
      <div className="flex h-full flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-semibold">{event.title}</div>
            <div className="mt-1 text-sm text-slate-300">{event.category}</div>
          </div>
        </div>

        {event.description ? <p className="text-sm text-slate-300">{event.description}</p> : null}

        <div className="mt-auto space-y-2 text-sm text-slate-300">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-cyan-200" />
            <span>{starts.toLocaleString()}</span>
          </div>

          {event.venueName || event.address ? (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-cyan-200" />
              <span>{event.venueName ?? event.address}</span>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
