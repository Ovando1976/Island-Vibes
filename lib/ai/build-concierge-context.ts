import type { EventRecord, PlaceRecord } from '@/lib/types';

type BuildConciergeContextInput = {
  message: string;
  places: PlaceRecord[];
  events: EventRecord[];
};

export function buildConciergeContext({ message, places, events }: BuildConciergeContextInput) {
  const lowered = message.toLowerCase();

  const filteredPlaces = places
    .filter((place) => {
      const haystack = [
        place.name,
        place.category,
        place.neighborhood,
        ...(place.tags ?? []),
        place.shortDescription,
        place.description,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return lowered.split(/\s+/).some((token) => token.length > 2 && haystack.includes(token));
    })
    .slice(0, 8);

  const filteredEvents = events
    .filter((event) => {
      const haystack = [event.title, event.category, event.venueName, event.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return lowered.split(/\s+/).some((token) => token.length > 2 && haystack.includes(token));
    })
    .slice(0, 6);

  const placesText =
    filteredPlaces.length > 0
      ? filteredPlaces
          .map(
            (place) =>
              `- ${place.name} (${place.category}, ${place.island}) — ${place.shortDescription ?? place.description ?? 'No description'}`,
          )
          .join('\n')
      : '- No strongly matching places found. Use best judgment from available island data.';

  const eventsText =
    filteredEvents.length > 0
      ? filteredEvents.map((event) => `- ${event.title} (${event.category}, ${event.island}) — starts ${event.startsAt}`).join('\n')
      : '- No strongly matching live events found.';

  return `User request:
${message}

Relevant places:
${placesText}

Relevant events:
${eventsText}

Instructions:
- Answer like a high-end local concierge.
- Be practical and concise.
- Prefer options grounded in the provided place and event data.
- If certainty is limited, say so plainly.
- Suggest up to 3 places max.`;
}
