import type { IslandCode } from '@/lib/types';

export const ISLAND_LABELS: Record<IslandCode, string> = {
  st_thomas: 'St. Thomas',
  st_john: 'St. John',
  st_croix: 'St. Croix',
};

export const PLACE_CATEGORY_LABELS = {
  beach: 'Beaches',
  restaurant: 'Food',
  shopping: 'Shopping',
  tour: 'Tours',
  landmark: 'Landmarks',
  nightlife: 'Nightlife',
  activity: 'Activities',
  family: 'Family',
  transport: 'Transport',
} as const;
