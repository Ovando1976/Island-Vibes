import { AppShell } from '@/components/app-shell';
import { PlaceCard } from '@/components/home/place-card';
import { SectionTitle } from '@/components/home/section-title';
import { getPlaces } from '@/lib/data';

export default async function ExplorePage() {
  const places = await getPlaces('st_thomas', 24);
  const beaches = places.filter((place) => place.category === 'beach');
  const transitFriendly = places.filter((place) => place.ferryFriendly);

  return (
    <AppShell title="Explore" subtitle="Discover what’s worth doing by island, vibe, and movement pattern.">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-4">
        <section>
          <SectionTitle
            title="Top beaches"
            subtitle="Start with the strongest visual and conversion-friendly category."
          />
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {beaches.map((place) => (
              <div key={place.id}>
                <PlaceCard place={place} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle
            title="Ferry-friendly picks"
            subtitle="Useful for visitors moving between St. Thomas and St. John."
          />
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {transitFriendly.map((place) => (
              <div key={place.id}>
                <PlaceCard place={place} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
