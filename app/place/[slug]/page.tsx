import { notFound } from 'next/navigation';

import { AppShell } from '@/components/app-shell';
import { Card } from '@/components/ui/card';
import { ISLAND_LABELS } from '@/lib/constants';
import { getPlaceBySlug } from '@/lib/data';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PlaceDetailPage({ params }: Props) {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);

  if (!place) {
    notFound();
  }

  return (
    <AppShell title={place.name} subtitle={`${ISLAND_LABELS[place.island]} · ${place.neighborhood ?? 'USVI'}`}>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-4">
        <Card>
          <div className="text-sm uppercase tracking-[0.22em] text-cyan-200/80">{place.category}</div>
          <h2 className="mt-2 text-3xl font-bold">{place.name}</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">{place.description ?? place.shortDescription}</p>
        </Card>

        <Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Meta label="Neighborhood" value={place.neighborhood} />
            <Meta label="Website" value={place.website} />
            <Meta label="Phone" value={place.phone} />
            <Meta label="Coordinates" value={`${place.lat.toFixed(4)}, ${place.lng.toFixed(4)}`} />
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

function Meta({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-2xl bg-white/5 px-4 py-3">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</div>
      <div className="mt-1 text-sm text-slate-200">{value ?? 'Not available'}</div>
    </div>
  );
}
