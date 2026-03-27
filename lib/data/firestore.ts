import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';

import { db } from '@/lib/firebase/client';
import {
  cruiseArrivalConverter,
  eventConverter,
  ferryDepartureConverter,
  placeConverter,
  taxiFareRuleConverter,
} from '@/lib/firebase/converters';
import type {
  CruiseArrivalRecord,
  EventRecord,
  FerryDepartureRecord,
  IslandCode,
  PlaceRecord,
  TaxiFareRule,
} from '@/lib/types';

export async function getPlacesLive(island?: IslandCode, maxResults = 24): Promise<PlaceRecord[]> {
  const base = collection(db, 'places').withConverter(placeConverter);

  const q = island
    ? query(
        base,
        where('published', '==', true),
        where('island', '==', island),
        orderBy('featuredScore', 'desc'),
        limit(maxResults),
      )
    : query(base, where('published', '==', true), orderBy('featuredScore', 'desc'), limit(maxResults));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}

export async function getPlaceBySlugLive(slug: string): Promise<PlaceRecord | null> {
  const base = collection(db, 'places').withConverter(placeConverter);
  const q = query(base, where('slug', '==', slug), where('published', '==', true), limit(1));
  const snapshot = await getDocs(q);
  return snapshot.docs[0]?.data() ?? null;
}

export async function getEventsLive(island?: IslandCode, maxResults = 20): Promise<EventRecord[]> {
  const base = collection(db, 'events').withConverter(eventConverter);

  const q = island
    ? query(
        base,
        where('published', '==', true),
        where('island', '==', island),
        orderBy('startsAt', 'asc'),
        limit(maxResults),
      )
    : query(base, where('published', '==', true), orderBy('startsAt', 'asc'), limit(maxResults));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}

export async function getFerryDeparturesLive(): Promise<FerryDepartureRecord[]> {
  const base = collection(db, 'ferryDepartures').withConverter(ferryDepartureConverter);
  const q = query(base, where('active', '==', true), orderBy('departureTimeLocal', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}

export async function getCruiseArrivalsLive(arrivalDate: string): Promise<CruiseArrivalRecord[]> {
  const base = collection(db, 'cruiseArrivals').withConverter(cruiseArrivalConverter);
  const q = query(base, where('arrivalDate', '==', arrivalDate));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}

export async function getTaxiFareRulesLive(): Promise<TaxiFareRule[]> {
  const base = collection(db, 'fareRules').withConverter(taxiFareRuleConverter);
  const snapshot = await getDocs(base);
  return snapshot.docs.map((doc) => doc.data());
}
