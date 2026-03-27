export type IslandCode = 'st_thomas' | 'st_john' | 'st_croix';

export type PlaceCategory =
  | 'beach'
  | 'restaurant'
  | 'shopping'
  | 'tour'
  | 'landmark'
  | 'nightlife'
  | 'activity'
  | 'family'
  | 'transport';

export type EventCategory =
  | 'music'
  | 'festival'
  | 'nightlife'
  | 'family'
  | 'food'
  | 'culture'
  | 'sports';

export type PlaceRecord = {
  id: string;
  slug: string;
  name: string;
  island: IslandCode;
  category: PlaceCategory;
  subcategory?: string;
  neighborhood?: string;
  description?: string;
  shortDescription?: string;
  lat: number;
  lng: number;
  address?: string;
  phone?: string;
  website?: string;
  imageUrls?: string[];
  tags?: string[];
  priceTier?: 1 | 2 | 3 | 4;
  rating?: number;
  reviewCount?: number;
  hours?: Record<string, string>;
  cruiseFriendly?: boolean;
  ferryFriendly?: boolean;
  familyFriendly?: boolean;
  rainFriendly?: boolean;
  featuredScore?: number;
  promotionActive?: boolean;
  published: boolean;
  source?: string;
  sourceUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type EventRecord = {
  id: string;
  slug: string;
  title: string;
  island: IslandCode;
  venueName?: string;
  category: EventCategory;
  description?: string;
  startsAt: string;
  endsAt?: string;
  address?: string;
  lat?: number;
  lng?: number;
  imageUrls?: string[];
  ticketUrl?: string;
  featuredScore?: number;
  published: boolean;
  source?: string;
  sourceUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type FerryRouteKey =
  | 'red_hook_to_cruz_bay'
  | 'cruz_bay_to_red_hook'
  | 'charlotte_amalie_to_cruz_bay'
  | 'cruz_bay_to_charlotte_amalie';

export type FerryDepartureRecord = {
  id: string;
  routeKey: FerryRouteKey;
  departureTimeLocal: string;
  arrivalTimeLocal?: string;
  operator?: string;
  departFrom: string;
  arriveAt: string;
  travelMinutes?: number;
  active: boolean;
  source?: string;
  sourceUrl?: string;
  updatedAt: string;
};

export type CruisePort = 'havensight' | 'crown_bay' | 'st_john';

export type CruiseArrivalRecord = {
  id: string;
  arrivalDate: string;
  port: CruisePort;
  shipName: string;
  eta?: string;
  etd?: string;
  passengerCapacity?: number;
  source?: string;
  sourceUrl?: string;
  updatedAt: string;
};

export type TaxiFareRule = {
  id: string;
  fromZone: string;
  toZone: string;
  farePerPerson?: number;
  flatFare?: number;
  luggageFee?: number;
  privateRideMultiplier?: number;
  notes?: string;
  source?: string;
  sourceUrl?: string;
  updatedAt: string;
};

export type TaxiEstimateInput = {
  fromZone: string;
  toZone: string;
  riders: number;
  luggageCount?: number;
  privateRide?: boolean;
};

export type TaxiEstimateResult = {
  foundRule: boolean;
  estimatedTotal: number | null;
  appliedRule?: TaxiFareRule;
  notes: string[];
};

export type HomeStatusSummary = {
  island: IslandCode;
  weatherLabel: string;
  cruisePressureLabel: 'light' | 'moderate' | 'heavy';
  nextFerryLabel?: string;
};
