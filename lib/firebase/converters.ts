import type { FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

import type { CruiseArrivalRecord, EventRecord, FerryDepartureRecord, PlaceRecord, TaxiFareRule } from '@/lib/types';

function makeConverter<T extends { id: string }>(): FirestoreDataConverter<T> {
  return {
    toFirestore(value: T) {
      return value;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): T {
      const data = snapshot.data(options) as Omit<T, 'id'>;
      return {
        id: snapshot.id,
        ...data,
      } as T;
    },
  };
}

export const placeConverter = makeConverter<PlaceRecord>();
export const eventConverter = makeConverter<EventRecord>();
export const ferryDepartureConverter = makeConverter<FerryDepartureRecord>();
export const cruiseArrivalConverter = makeConverter<CruiseArrivalRecord>();
export const taxiFareRuleConverter = makeConverter<TaxiFareRule>();
