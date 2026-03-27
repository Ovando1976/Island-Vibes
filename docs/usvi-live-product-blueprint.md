# USVI Live Product Blueprint (MVP → Platform)

## 1) Product Positioning

**Product name:** USVI Live  
**Tagline:** _Your live island companion for the USVI._

**Core promise:**
> Tell me where I am, what’s worth doing right now, and the smartest way to move around the islands.

**Launch scope (Phase 1):** St. Thomas + St. John  
**Expansion scope (Phase 2):** St. Croix + BVI add-ons

---

## 2) North-Star Jobs To Be Done

1. “What should I do **right now** near me?”
2. “Can I still make the ferry, and how do I get there?”
3. “What should this taxi ride cost?”
4. “How do cruise arrivals change my options today?”
5. “What events are happening tonight?”

The app should optimize for **live decisions**, not static planning.

---

## 3) MVP Feature Set (Version 1)

### A. Live Home Feed
- Geolocated island + neighborhood context
- Weather snapshot + comfort index (sun/rain/wind)
- Time-aware recommendations (now/next 2 hours/tonight)
- Crowd-aware cards (high/medium/low pressure)
- “Good right now” filters:
  - Family
  - Cruise stop
  - Romantic
  - Local food
  - Budget
- Event strip for same-day happenings

### B. Ferry Planner
- Routes:
  - Red Hook ↔ Cruz Bay
  - Charlotte Amalie ↔ Cruz Bay
- Next departures + confidence label
- “Leave now” timer using user location + taxi ETA assumptions
- Buffer recommendations by traveler type:
  - Cruise guest
  - Stayover visitor
  - Family w/kids

### C. Taxi Fare Helper
- Inputs:
  - Pickup zone
  - Dropoff zone
  - Rider count
  - Luggage count
  - Shared/private mode
- Outputs:
  - Expected fare range
  - Fare breakdown guidance
  - Tip guidance
  - “Looks high” warning if quoted rate is outside expected bounds

### D. Cruise Mode
- Auto-detect cruise day pressure from active ship calls
- Time-boxed templates: 3-hour stop, half-day stop
- Walkable-from-port and low-stress options
- Return-to-ship safety buffer and reminders

### E. AI Concierge
- Grounded on app data (events, transport, venue metadata)
- Fast intents:
  - “Best beach from cruise dock”
  - “Can I do St. John and return by X time?”
  - “Taxi estimate from A to B”
  - “What’s happening tonight near me?”

---

## 4) App Information Architecture (Tabs + Core Screens)

## Primary Tabs
1. **Home**
2. **Explore**
3. **Transit**
4. **Events**
5. **Trip**

### 4.1 Home Tab
**Goal:** Instant actionable plan.

Screens/components:
- Location chip (island/neighborhood)
- Weather + crowd pulse row
- “Do this now” carousel
- “Open now nearby” list
- “Best for your window” cards (e.g., 2h, 4h, full day)

### 4.2 Transit Tab
**Goal:** Remove transport anxiety.

Subtabs:
- **Ferries**
- **Taxi Fare**
- **Route Helper**

Key interactions:
- “Can I make the 2:30 PM ferry?” simulation
- “Get me from Havensight to Red Hook” quick action

### 4.3 Explore Tab
**Goal:** Match visitors to the right experiences.

Subsections:
- Beaches
- Food
- Tours & Water Activities
- Shopping
- Day-trip bundles

Ranking signals:
- Distance/time-to-arrive
- Crowd pressure
- Open/closed confidence
- User preferences
- Sponsored boost (with caps and labels)

### 4.4 Events Tab
**Goal:** Make events first-class, not hidden.

Views:
- Today
- This Weekend
- Date selector

Cards include:
- Start/end time
- Venue + map anchor
- Audience tags (family, nightlife, culture)
- “Can I reach this from my location?” helper

### 4.5 Trip Tab
**Goal:** Personal trip layer for planning and recovery.

Features:
- Saved places and favorites
- Saved itinerary blocks
- Pinned ferry route
- Offline essentials
- Share trip actions

---

## 5) Key User Flows

### Flow 1: Cruise Passenger, 6-hour stop
1. User selects “Cruise mode” + dock + all-aboard time.
2. Home feed switches to short-window recommendations.
3. Assistant suggests 2–3 low-risk plans.
4. Move tab calculates taxi + ferry feasibility.
5. User books one experience.

### Flow 2: Hotel Guest, no rental car
1. User sets preferences (food + beach + budget).
2. Now feed highlights nearby options + evening event.
3. Taxi helper validates fare expectations.
4. Route helper sequences ride + ferry timings.

### Flow 3: Family with mobility constraints
1. User enables mobility and kid-friendly filters.
2. Discover suppresses difficult terrain options.
3. Planner outputs low-transfer itinerary blocks.

---

## 6) Data Model (Firestore Collections)

Below is a practical Firestore-first schema for MVP.

### 6.1 Core Collections

#### `places`
- `name`
- `type` (beach, restaurant, tour, shop, venue)
- `island` (st_thomas, st_john, st_croix)
- `neighborhood`
- `geo` (GeoPoint)
- `hours` (structured weekly schedule)
- `priceBand`
- `tags[]`
- `familyFriendly` (bool)
- `mobilityNotes`
- `bookingLink`
- `sponsorTier` (none, boost, featured)
- `status` (active, seasonal, paused)

#### `events`
- `title`
- `description`
- `island`
- `venuePlaceId`
- `startAt`
- `endAt`
- `category` (music, culture, food, nightlife, family)
- `ticketUrl`
- `source`
- `promoted` (bool)
- `freshUntil`

#### `ferry_routes`
- `routeKey` (redhook_cruzbay)
- `fromTerminal`
- `toTerminal`
- `operator`
- `crossingMins`
- `notes`

#### `ferry_sailings`
- `routeKey`
- `departureAt`
- `arrivalAt`
- `serviceDate`
- `status` (scheduled, delayed, canceled)
- `confidence` (official, observed, inferred)

#### `taxi_zones`
- `zoneName`
- `island`
- `zoneType` (dock, airport, beach, town, terminal)
- `geo`

#### `taxi_rates_reference`
- `fromZoneId`
- `toZoneId`
- `baseFarePerPerson`
- `luggageRule`
- `privateMin`
- `sharedTypical`
- `sourceRef`
- `effectiveDate`

#### `cruise_calls`
- `shipName`
- `dock`
- `arrivalAt`
- `departureAt`
- `passengerCapacity`
- `status`
- `source`

### 6.2 User + Personalization Collections

#### `users`
- `homeBaseIsland`
- `travelerType` (cruise, stayover)
- `partyProfile` (couple, family, solo, group)
- `mobilityNeeds`
- `budgetLevel`

#### `user_sessions`
- `userId`
- `tripStart`
- `tripEnd`
- `currentIsland`
- `arrivalMode`
- `allAboardTime` (optional)

#### `saved_plans`
- `userId`
- `date`
- `blocks[]` (morning/midday/sunset)
- `transportLegs[]`
- `version`

#### `assistant_threads`
- `userId`
- `contextSnapshot`
- `messages[]`
- `actions[]`

### 6.3 Monetization Collections

#### `business_profiles`
- `placeId`
- `ownerId`
- `planTier` (free, pro, premium)
- `leadEmail`
- `billingStatus`

#### `sponsored_campaigns`
- `businessId`
- `placementType` (discover_card, now_feed, event_spotlight)
- `startAt`
- `endAt`
- `budget`
- `targeting`
- `status`

#### `referral_clicks`
- `userId` (nullable)
- `placeId`
- `campaignId` (nullable)
- `clickedAt`
- `channel`

#### `bookings_attribution`
- `partner`
- `placeId`
- `userId` (nullable)
- `conversionAt`
- `commissionAmount`
- `status`

---

## 7) Realtime + Rules Engine

## 7.1 Decision Inputs
- User location
- Time window
- Weather severity
- Cruise pressure index
- Ferry feasibility score
- Place open-confidence

## 7.2 Outputs
- `now_recommendation_score`
- `transport_risk_score`
- `crowd_avoidance_hint`
- `return-to-ship safety flag` (if cruise mode)

## 7.3 Triggered Alerts
- “Leave in 20 minutes to catch next ferry.”
- “Cruise influx high near downtown; consider alternate beach.”
- “Quoted taxi fare appears above expected range.”

---

## 8) Monetization Hooks in Product UX

1. **Sponsored cards** in Discover/Now with explicit labeling.
2. **Featured event boost** in Events tab.
3. **Lead forms** for taxi/tour operators in-app.
4. **Referral deep links** for bookable products.
5. **Premium tourist pass** (offline plan, alerts, saved itineraries).
6. **Business portal upsell** from claim-listing CTA.

---

## 9) KPI Framework

### Tourist-side KPIs
- D1/D7 retention
- Sessions per active trip day
- “Useful in first 3 minutes” rate
- Ferry-planner usage rate
- Taxi-helper usage rate
- Assistant resolution rate

### Business-side KPIs
- CTR on sponsored placements
- Lead conversion rate
- Revenue per active business
- Repeat spend by advertisers
- Commission revenue per 1k tourists

---

## 10) 90-Day Execution Plan

### Phase 0 (Weeks 1–2): Foundations
- Finalize taxonomy (islands, neighborhoods, zones)
- Seed core places/events/ferry/taxi datasets
- Build ingestion jobs for cruise + ferry schedule sources

### Phase 1 (Weeks 3–6): MVP App
- Ship tabs: Home, Explore, Transit, Events, Trip
- Implement ferry planner + taxi helper calculators
- Launch basic AI concierge with tool-calling hooks

### Phase 2 (Weeks 7–10): Monetization Layer
- Add sponsored placement pipeline
- Implement click attribution + referral tracking
- Launch business claim/profile flow

### Phase 3 (Weeks 11–13): Optimization
- Improve ranking with behavior + conversion signals
- Add proactive alerts and replan actions
- Prepare St. Croix dataset rollout

---

## 11) Technical Build Notes (Firebase-first)

- **Firestore** for operational entities (places, events, schedules, rates, campaigns).
- **Cloud Functions** for:
  - schedule ingestion/normalization
  - recommendation precomputation
  - alert generation
  - attribution webhooks
- **Firebase Auth** for traveler sessions + business accounts.
- **Remote Config** for ranking weights and experimentation.
- **Analytics** events for every recommendation impression, click, route action, and conversion.

---

## 12) MVP Definition of Done

MVP is “done” when a first-time visitor can:
1. Open app and get location-aware recommendations in <10 seconds.
2. Validate ferry feasibility for a same-day St. Thomas ↔ St. John trip.
3. Check expected taxi fare between major tourist zones.
4. Ask assistant for a viable short-window itinerary.
5. Complete at least one discover→book or discover→lead action.

