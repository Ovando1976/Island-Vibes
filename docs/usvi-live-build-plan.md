# USVI Live — Implementation Build Plan (30-Day)

This is the concrete execution plan to build **USVI Live** as a real-time island companion for **St. Thomas + St. John**.

## 1) Next.js App Route Map (Exact)

```txt
app/
  (marketing)/
    page.tsx                        # Landing + value proposition
  (tourist)/
    home/page.tsx                   # Live feed (weather + ferry + cruise pressure + recommendations)
    explore/page.tsx                # Map + category cards + near-me
    transit/page.tsx                # Ferry planner + taxi fare helper + route assistant
    events/page.tsx                 # Today / tonight / weekend events
    trip/page.tsx                   # Saved places + itinerary + favorites + offline essentials
    assistant/page.tsx              # AI concierge UI (grounded answers)
    place/[placeId]/page.tsx        # Place details + action buttons
    event/[eventId]/page.tsx        # Event details + route + save
  api/
    home-feed/route.ts              # Aggregated live home response
    ferry/next/route.ts             # Next departures by route + feasibility
    ferry/feasibility/route.ts      # Can I make it?
    taxi/estimate/route.ts          # Fare estimate + notes + warning flag
    cruise/pressure/route.ts        # Port pressure score
    events/live/route.ts            # Time-window filtered events
    assistant/query/route.ts        # Grounded assistant response + tool actions
    ingestion/
      ferry/route.ts                # Scheduled ferry ingest webhook/cron
      cruise/route.ts               # Scheduled cruise ingest webhook/cron
      events/route.ts               # Events ingest webhook/cron
```

## 2) Firestore Collections (Exact)

### Core visitor collections
- `places`
- `events`
- `ferry_routes`
- `ferry_departures`
- `cruise_arrivals`
- `taxi_zones`
- `fare_rules`

### User/trip collections
- `itineraries`
- `saved_places`
- `trip_profiles`
- `assistant_threads`

### Revenue collections
- `business_profiles`
- `promotions`
- `lead_events`
- `analytics_daily`

## 3) Initial Firestore Index Plan

1. `places`: `(island ASC, category ASC, updatedAt DESC)`
2. `events`: `(island ASC, startAt ASC)`
3. `events`: `(startAt ASC, endAt ASC)`
4. `ferry_departures`: `(routeKey ASC, departureTimeLocal ASC)`
5. `cruise_arrivals`: `(arrivalDate ASC, port ASC)`
6. `fare_rules`: `(fromZoneId ASC, toZoneId ASC)`
7. `promotions`: `(island ASC, startsAt ASC, endsAt ASC)`

## 4) API Contracts (MVP)

### `GET /api/home-feed?island=st_thomas&lat=...&lng=...`
Returns:
- weather summary
- cruise pressure
- next ferry summary
- top “best right now” cards
- events tonight

### `GET /api/ferry/next?routeKey=red_hook_cruz_bay`
Returns:
- next departures
- travel minutes
- confidence

### `POST /api/ferry/feasibility`
Body:
- user location
- target departure
- mode assumptions (taxi/private)
Returns:
- feasible boolean
- leave-by timestamp
- buffer minutes

### `POST /api/taxi/estimate`
Body:
- from zone
- to zone
- riders
- luggage
- shared/private
Returns:
- expected range
- midpoint
- caveats
- overcharge warning threshold

### `POST /api/assistant/query`
Body:
- message
- trip context
- location
Returns:
- concise answer
- citations to internal entities (place/event/ferry/cruise)
- suggested quick actions

## 5) Production-Ready Page Sequence

### Week 1 (Shell + Home)
- `home/page.tsx` live hero + recommendation cards
- Server action/API for home-feed aggregation
- Basic analytics events

### Week 2 (Transit)
- `transit/page.tsx`
- Ferry next departures module
- Feasibility calculator
- Taxi fare helper calculator

### Week 3 (Explore + Events)
- `explore/page.tsx` (map/list toggle)
- `events/page.tsx` (today/tonight/weekend)
- Save place/event actions

### Week 4 (Trip + Assistant)
- `trip/page.tsx`
- `assistant/page.tsx` with grounded retrieval and action chips
- QA hardening + instrumentation

## 6) Data Ingestion Jobs (Cron)

- Ferry ingestion: every 15 minutes
- Cruise ingestion: daily + morning refresh
- Events ingestion: hourly merge/refresh
- Place hours integrity check: nightly

## 7) 5 MVP Components to Ship First

1. `LiveHomeHero`
2. `FerryPlannerPanel`
3. `TaxiFareEstimator`
4. `CruisePressureChip`
5. `GroundedAssistantPanel`

## 8) Acceptance Criteria

- User can answer “what should I do now?” in < 10s from app open.
- User can evaluate ferry feasibility with leave-by recommendation.
- User can estimate taxi fare with transparent assumptions.
- User can view live events by today/tonight/weekend.
- User can ask assistant and receive grounded, actionable response.
