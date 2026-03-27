import { AppShell } from '@/components/app-shell';
import { ConciergePanel } from '@/components/ai/concierge-panel';
import { CruisePressureCard } from '@/components/home/cruise-pressure-card';
import { FerryAlertCard } from '@/components/home/ferry-alert-card';
import { HeroStatusBar } from '@/components/home/hero-status-bar';
import { PlaceCard } from '@/components/home/place-card';
import { SectionTitle } from '@/components/home/section-title';
import { ISLAND_LABELS } from '@/lib/constants';
import { getCruiseArrivals, getFerryDepartures, getPlaces } from '@/lib/data';
import { getNextFerryDeparture, minutesUntil } from '@/lib/transit/next-ferry';

export default async function HomePage() {
  const island = 'st_thomas';
  const today = new Date().toISOString().slice(0, 10);

  const [places, departures, cruiseArrivals] = await Promise.all([
    getPlaces(island, 8),
    getFerryDepartures(),
    getCruiseArrivals(today),
  ]);

  const highlightedPlaces = places
    .filter((place) => place.island === island || place.ferryFriendly)
    .sort((a, b) => (b.featuredScore ?? 0) - (a.featuredScore ?? 0))
    .slice(0, 4);

  const nextFerry = getNextFerryDeparture(departures, 'red_hook_to_cruz_bay');

  const totalPassengers = cruiseArrivals.reduce((sum, item) => sum + (item.passengerCapacity ?? 0), 0);

  return (
    <AppShell title="Home" subtitle="A live island feed for tourists, day-trippers, and cruise visitors.">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4">
        <HeroStatusBar
          islandLabel={ISLAND_LABELS[island]}
          weatherLabel="Warm trade-wind day"
          cruisePressureLabel={totalPassengers >= 5000 ? 'Heavy' : 'Moderate'}
          nextFerryLabel={nextFerry ? `${minutesUntil(nextFerry.departureDate)} min to Cruz Bay` : 'No active ferry'}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionTitle
              title="Best right now"
              subtitle="These are the kinds of recommendations that make the app feel alive."
            />
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {highlightedPlaces.map((place) => (
                <div key={place.id}>
                  <PlaceCard place={place} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <FerryAlertCard
              label={nextFerry ? 'Next St. John connection' : 'No active ferry found'}
              minutes={nextFerry ? minutesUntil(nextFerry.departureDate) : null}
              route="Red Hook → Cruz Bay"
            />

            <CruisePressureCard shipsInPort={cruiseArrivals.length} passengerEstimate={totalPassengers} />
          </div>
        </div>

        <ConciergePanel />
      </div>
    </AppShell>
  );
}
