import { Card } from '@/components/ui/card';

type HeroStatusBarProps = {
  islandLabel: string;
  weatherLabel: string;
  cruisePressureLabel: string;
  nextFerryLabel?: string;
};

export function HeroStatusBar({ islandLabel, weatherLabel, cruisePressureLabel, nextFerryLabel }: HeroStatusBarProps) {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-cyan-500/20 via-sky-500/10 to-fuchsia-500/10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-200/80">Live island companion</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">Good moves, right now.</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-200">
            See the smartest next step for your day in {islandLabel}, with live transit cues and local discovery.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 md:min-w-[360px]">
          <StatusChip label="Island" value={islandLabel} />
          <StatusChip label="Weather" value={weatherLabel} />
          <StatusChip label="Cruise" value={cruisePressureLabel} />
          <StatusChip label="Next Ferry" value={nextFerryLabel ?? 'No alert'} />
        </div>
      </div>
    </Card>
  );
}

function StatusChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3">
      <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}
