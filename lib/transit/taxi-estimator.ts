import type { TaxiEstimateInput, TaxiEstimateResult, TaxiFareRule } from '@/lib/types';

export function estimateTaxiFare(rules: TaxiFareRule[], input: TaxiEstimateInput): TaxiEstimateResult {
  const notes: string[] = [];

  const match = rules.find(
    (rule) =>
      rule.fromZone.toLowerCase() === input.fromZone.toLowerCase() &&
      rule.toZone.toLowerCase() === input.toZone.toLowerCase(),
  );

  if (!match) {
    return {
      foundRule: false,
      estimatedTotal: null,
      notes: ['No fare rule found for that route yet.'],
    };
  }

  let total = 0;

  if (typeof match.flatFare === 'number') {
    total = match.flatFare;
    notes.push('Using flat fare rule.');
  } else if (typeof match.farePerPerson === 'number') {
    total = match.farePerPerson * Math.max(1, input.riders);
    notes.push('Using per-person fare rule.');
  }

  if (match.luggageFee && input.luggageCount) {
    total += match.luggageFee * input.luggageCount;
    notes.push('Luggage estimate applied.');
  }

  if (input.privateRide && match.privateRideMultiplier) {
    total *= match.privateRideMultiplier;
    notes.push('Private ride multiplier applied.');
  }

  if (match.notes) {
    notes.push(match.notes);
  }

  return {
    foundRule: true,
    estimatedTotal: Number(total.toFixed(2)),
    appliedRule: match,
    notes,
  };
}
