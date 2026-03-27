import { AppShell } from '@/components/app-shell';
import { FerryPlanner } from '@/components/transit/ferry-planner';
import { TaxiFareEstimator } from '@/components/transit/taxi-fare-estimator';
import { getFerryDepartures, getTaxiFareRules } from '@/lib/data';

export default async function TransitPage() {
  const [departures, rules] = await Promise.all([getFerryDepartures(), getTaxiFareRules()]);

  return (
    <AppShell title="Transit" subtitle="Help visitors move confidently through St. Thomas and St. John.">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-4 lg:grid-cols-2">
        <FerryPlanner departures={departures} routeKey="red_hook_to_cruz_bay" title="Red Hook → Cruz Bay" />

        <TaxiFareEstimator rules={rules} />

        <FerryPlanner departures={departures} routeKey="cruz_bay_to_red_hook" title="Cruz Bay → Red Hook" />

        <FerryPlanner
          departures={departures}
          routeKey="charlotte_amalie_to_cruz_bay"
          title="Charlotte Amalie → Cruz Bay"
        />
      </div>
    </AppShell>
  );
}
