import {
  getCruiseArrivalsLive,
  getEventsLive,
  getFerryDeparturesLive,
  getPlaceBySlugLive,
  getPlacesLive,
  getTaxiFareRulesLive,
} from '@/lib/data/firestore';
import { seedCruiseArrivals, seedFerryDepartures, seedPlaces, seedTaxiFareRules } from '@/lib/data/seed';
import type {
  CruiseArrivalRecord,
  EventRecord,
  FerryDepartureRecord,
  IslandCode,
  PlaceRecord,
  TaxiFareRule,
} from '@/lib/types';

const USE_SEED = process.env.NEXT_PUBLIC_USE_SEED_DATA === 'true';

export async function getPlaces(island?: IslandCode, maxResults = 24): Promise<PlaceRecord[]> {
  if (USE_SEED) {
    const filtered = island ? seedPlaces.filter((place) => place.island === island) : seedPlaces;
    return filtered.slice(0, maxResults);
  }

  try {
    return await getPlacesLive(island, maxResults);
  } catch (error) {
    console.error('getPlaces failed, falling back to seed data', error);
    const filtered = island ? seedPlaces.filter((place) => place.island === island) : seedPlaces;
    return filtered.slice(0, maxResults);
  }
}

export async function getPlaceBySlug(slug: string): Promise<PlaceRecord | null> {
  if (USE_SEED) {
    return seedPlaces.find((place) => place.slug === slug) ?? null;
  }

  try {
    return await getPlaceBySlugLive(slug);
  } catch (error) {
    console.error('getPlaceBySlug failed, falling back to seed data', error);
    return seedPlaces.find((place) => place.slug === slug) ?? null;
  }
}

export async function getEvents(island?: IslandCode, maxResults = 20): Promise<EventRecord[]> {
  if (USE_SEED) return [];

  try {
    return await getEventsLive(island, maxResults);
  } catch (error) {
    console.error('getEvents failed', error);
    return [];
  }
}

export async function getFerryDepartures(): Promise<FerryDepartureRecord[]> {
  if (USE_SEED) return seedFerryDepartures;

  try {
    return await getFerryDeparturesLive();
  } catch (error) {
    console.error('getFerryDepartures failed, falling back to seed data', error);
    return seedFerryDepartures;
  }
}

export async function getCruiseArrivals(arrivalDate: string): Promise<CruiseArrivalRecord[]> {
  if (USE_SEED) return seedCruiseArrivals;

  try {
    return await getCruiseArrivalsLive(arrivalDate);
  } catch (error) {
    console.error('getCruiseArrivals failed, falling back to seed data', error);
    return seedCruiseArrivals;
  }
}

export async function getTaxiFareRules(): Promise<TaxiFareRule[]> {
  if (USE_SEED) return seedTaxiFareRules;

  try {
    return await getTaxiFareRulesLive();
  } catch (error) {
    console.error('getTaxiFareRules failed, falling back to seed data', error);
    return seedTaxiFareRules;
  }
}
