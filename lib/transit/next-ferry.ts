import type { FerryDepartureRecord, FerryRouteKey } from '@/lib/types';

export function getNextFerryDeparture(
  departures: FerryDepartureRecord[],
  routeKey: FerryRouteKey,
  now = new Date(),
) {
  const next = departures
    .filter((item) => item.routeKey === routeKey && item.active)
    .map((item) => ({
      ...item,
      departureDate: new Date(item.departureTimeLocal),
    }))
    .filter((item) => !Number.isNaN(item.departureDate.getTime()))
    .filter((item) => item.departureDate.getTime() >= now.getTime())
    .sort((a, b) => a.departureDate.getTime() - b.departureDate.getTime())[0];

  return next ?? null;
}

export function minutesUntil(dateLike: string | Date, now = new Date()) {
  const target = typeof dateLike === 'string' ? new Date(dateLike) : dateLike;
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.round(diff / 60000));
}
