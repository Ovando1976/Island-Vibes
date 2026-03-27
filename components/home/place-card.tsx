import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { ISLAND_LABELS } from '@/lib/constants';
import type { PlaceRecord } from '@/lib/types';

export function PlaceCard({ place }: { place: PlaceRecord }) {
  return (
    <Link href={`/place/${place.slug}`}>
      <Card className="h-full transition hover:border-cyan-300/30 hover:bg-white/10">
        <div className="flex h-full flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-lg font-semibold">{place.name}</div>
              <div className="mt-1 text-sm text-slate-300">
                {ISLAND_LABELS[place.island]} · {place.neighborhood ?? 'USVI'}
              </div>
            </div>

            {place.rating ? (
              <div className="flex items-center gap-1 rounded-full bg-yellow-400/10 px-2 py-1 text-xs text-yellow-200">
                <Star className="h-3.5 w-3.5" />
                {place.rating.toFixed(1)}
              </div>
            ) : null}
          </div>

          <p className="text-sm text-slate-300">{place.shortDescription ?? place.description ?? 'Island favorite.'}</p>

          <div className="mt-auto flex flex-wrap gap-2">
            {place.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-200"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1 text-xs text-cyan-200">
            <MapPin className="h-3.5 w-3.5" />
            View details
          </div>
        </div>
      </Card>
    </Link>
  );
}
