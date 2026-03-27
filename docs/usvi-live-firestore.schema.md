# USVI Live Firestore Schema (MVP)

This schema is intentionally focused on real-time tourist decisions for St. Thomas + St. John.

## `places/{placeId}`
```ts
{
  name: string;
  island: 'st_thomas' | 'st_john' | 'st_croix';
  category: 'beach' | 'restaurant' | 'shopping' | 'tour' | 'landmark' | 'nightlife';
  subcategory?: string;
  neighborhood?: string;
  geo: { lat: number; lng: number };
  description?: string;
  hours?: Record<string, string>;
  priceTier?: 1 | 2 | 3 | 4;
  tags?: string[];
  cruiseFriendly?: boolean;
  familyFriendly?: boolean;
  rainFriendly?: boolean;
  source?: string;
  sourceUrl?: string;
  rating?: number;
  reviewCount?: number;
  featuredUntil?: string | null;
  updatedAt: string;
}
```

## `events/{eventId}`
```ts
{
  title: string;
  island: 'st_thomas' | 'st_john' | 'st_croix';
  placeId?: string;
  startAt: string;
  endAt: string;
  category: 'music' | 'culture' | 'food' | 'nightlife' | 'family' | 'festival';
  ticketUrl?: string;
  promoted?: boolean;
  source?: string;
  sourceUrl?: string;
  updatedAt: string;
}
```

## `ferry_routes/{routeKey}`
```ts
{
  routeKey: 'red_hook_cruz_bay' | 'charlotte_amalie_cruz_bay';
  fromTerminal: string;
  toTerminal: string;
  defaultTravelMinutes: number;
  operatorNames?: string[];
  active: boolean;
  updatedAt: string;
}
```

## `ferry_departures/{departureId}`
```ts
{
  routeKey: 'red_hook_cruz_bay' | 'charlotte_amalie_cruz_bay';
  departureTimeLocal: string;
  departFrom: string;
  arriveAt: string;
  travelMinutes?: number;
  operator?: string;
  active: boolean;
  sourceUrl?: string;
  updatedAt: string;
}
```

## `cruise_arrivals/{arrivalId}`
```ts
{
  port: 'havensight' | 'crown_bay' | 'st_john_tender';
  shipName: string;
  arrivalDate: string;
  eta?: string;
  etd?: string;
  passengerCapacity?: number;
  sourceUrl?: string;
  updatedAt: string;
}
```

## `taxi_zones/{zoneId}`
```ts
{
  name: string;
  island: 'st_thomas' | 'st_john' | 'st_croix';
  zoneType: 'airport' | 'port' | 'ferry' | 'beach' | 'town' | 'hotel';
  geo: { lat: number; lng: number };
  updatedAt: string;
}
```

## `fare_rules/{ruleId}`
```ts
{
  fromZoneId: string;
  toZoneId: string;
  perPersonBase: number;
  luggageFee?: number;
  privateMin?: number;
  sharedTypical?: number;
  notes?: string[];
  sourceUrl?: string;
  effectiveDate: string;
  updatedAt: string;
}
```

## `itineraries/{itineraryId}`
```ts
{
  userId: string;
  island: 'st_thomas' | 'st_john' | 'st_croix';
  date: string;
  blocks: Array<{
    label: 'morning' | 'midday' | 'sunset' | 'night';
    placeIds: string[];
    notes?: string;
  }>;
  pinnedFerryRouteKey?: 'red_hook_cruz_bay' | 'charlotte_amalie_cruz_bay';
  updatedAt: string;
}
```

## `saved_places/{savedId}`
```ts
{
  userId: string;
  placeId: string;
  createdAt: string;
}
```

## `business_profiles/{businessId}`
```ts
{
  placeId: string;
  ownerUserId: string;
  planTier: 'free' | 'pro' | 'premium';
  leadEmail?: string;
  phone?: string;
  active: boolean;
  updatedAt: string;
}
```

## `promotions/{promotionId}`
```ts
{
  businessId: string;
  island: 'st_thomas' | 'st_john' | 'st_croix';
  placement: 'home' | 'explore' | 'events';
  startsAt: string;
  endsAt: string;
  status: 'draft' | 'active' | 'paused' | 'expired';
  budget?: number;
  updatedAt: string;
}
```

## `lead_events/{leadEventId}`
```ts
{
  businessId: string;
  placeId?: string;
  userId?: string;
  eventType: 'click' | 'call' | 'booking_handoff' | 'message';
  sourceSurface: 'home' | 'explore' | 'events' | 'assistant';
  createdAt: string;
}
```

## `analytics_daily/{yyyymmdd}`
```ts
{
  date: string;
  dau: number;
  homeFeedViews: number;
  ferryChecks: number;
  taxiEstimates: number;
  assistantQueries: number;
  leadsGenerated: number;
  bookingsAttributed: number;
  updatedAt: string;
}
```
