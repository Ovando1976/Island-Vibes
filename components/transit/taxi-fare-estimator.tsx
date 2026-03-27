'use client';

import { type ReactNode, useMemo, useState } from 'react';

import { Card } from '@/components/ui/card';
import { estimateTaxiFare } from '@/lib/transit/taxi-estimator';
import type { TaxiFareRule } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

type Props = {
  rules: TaxiFareRule[];
};

export function TaxiFareEstimator({ rules }: Props) {
  const [fromZone, setFromZone] = useState('Havensight');
  const [toZone, setToZone] = useState('Magens Bay');
  const [riders, setRiders] = useState(2);
  const [luggageCount, setLuggageCount] = useState(0);
  const [privateRide, setPrivateRide] = useState(false);

  const result = useMemo(
    () =>
      estimateTaxiFare(rules, {
        fromZone,
        toZone,
        riders,
        luggageCount,
        privateRide,
      }),
    [fromZone, toZone, riders, luggageCount, privateRide, rules],
  );

  return (
    <Card className="space-y-4">
      <div>
        <div className="text-lg font-semibold">Taxi fare helper</div>
        <p className="mt-1 text-sm text-slate-300">Give visitors a quick estimate before they ride.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <LabeledField label="From">
          <input
            value={fromZone}
            onChange={(e) => setFromZone(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-3 py-3 text-sm outline-none"
          />
        </LabeledField>

        <LabeledField label="To">
          <input
            value={toZone}
            onChange={(e) => setToZone(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-3 py-3 text-sm outline-none"
          />
        </LabeledField>

        <LabeledField label="Riders">
          <input
            type="number"
            min={1}
            value={riders}
            onChange={(e) => setRiders(Number(e.target.value) || 1)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-3 py-3 text-sm outline-none"
          />
        </LabeledField>

        <LabeledField label="Luggage">
          <input
            type="number"
            min={0}
            value={luggageCount}
            onChange={(e) => setLuggageCount(Number(e.target.value) || 0)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-3 py-3 text-sm outline-none"
          />
        </LabeledField>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-200">
        <input type="checkbox" checked={privateRide} onChange={(e) => setPrivateRide(e.target.checked)} />
        Private ride
      </label>

      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
        <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/80">Estimate</div>
        <div className="mt-2 text-3xl font-bold">
          {result.estimatedTotal !== null ? formatCurrency(result.estimatedTotal) : 'Unavailable'}
        </div>
        <div className="mt-2 text-sm text-slate-200">
          {result.foundRule ? 'Route rule found.' : 'No matching rule has been loaded yet.'}
        </div>
      </div>

      {result.notes.length > 0 ? (
        <div className="space-y-2 text-sm text-slate-300">
          {result.notes.map((note) => (
            <div key={note} className="rounded-xl bg-white/5 px-3 py-2">
              {note}
            </div>
          ))}
        </div>
      ) : null}
    </Card>
  );
}

function LabeledField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <div className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-400">{label}</div>
      {children}
    </label>
  );
}
