import { AppShell } from '@/components/app-shell';
import { EventCard } from '@/components/events/event-card';
import { SectionTitle } from '@/components/home/section-title';
import { getEvents } from '@/lib/data';

export default async function EventsPage() {
  const events = await getEvents('st_thomas', 12);

  return (
    <AppShell title="Events" subtitle="This is where the island starts to feel alive in-app.">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4">
        <SectionTitle
          title="Today and next up"
          subtitle="Promotable, bookable, and highly monetizable once businesses plug in."
        />

        {events.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <div key={event.id}>
                <EventCard event={event} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-6 text-sm text-slate-300">
            No live events loaded yet. Seed or sync your first event records into Firestore to activate this feed.
          </div>
        )}
      </div>
    </AppShell>
  );
}
