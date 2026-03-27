import { AppShell } from '@/components/app-shell';
import { Card } from '@/components/ui/card';

export default function TripPage() {
  return (
    <AppShell title="Trip" subtitle="This becomes the saved layer: favorites, itinerary, and re-plan.">
      <div className="mx-auto w-full max-w-5xl px-4 py-4">
        <Card>
          <h2 className="text-xl font-semibold">Trip planner coming next</h2>
          <p className="mt-2 text-sm text-slate-300">
            Next pass: saved places, favorite routes, quick itinerary builder, and shareable day plans.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
