import OpenAI from 'openai';
import { NextResponse } from 'next/server';

import { buildConciergeContext } from '@/lib/ai/build-concierge-context';
import { getEvents, getPlaces } from '@/lib/data';
import type { IslandCode } from '@/lib/types';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ConciergeRequest = {
  island?: IslandCode;
  message?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ConciergeRequest;

    if (!body.message || !body.island) {
      return NextResponse.json({ error: 'Missing island or message.' }, { status: 400 });
    }

    const [places, events] = await Promise.all([getPlaces(body.island, 24), getEvents(body.island, 16)]);

    const context = buildConciergeContext({
      message: body.message,
      places,
      events,
    });

    const completion = await client.responses.create({
      model: 'gpt-5-mini',
      input: context,
    });

    const answer =
      completion.output_text?.trim() ||
      'I found a few island options, but I could not produce a full concierge answer just now.';

    const lowered = body.message.toLowerCase();

    const suggestedPlaces = places
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
      .slice(0, 3);

    const suggestedEvents = events.slice(0, 2).map((event) => ({
      id: event.id,
      title: event.title,
    }));

    return NextResponse.json({
      answer,
      suggestedPlaces,
      suggestedEvents,
      disclaimers: ['Transit timing, opening hours, and event availability can change.'],
    });
  } catch (error) {
    console.error('Concierge route failed:', error);
    return NextResponse.json({ error: 'Unable to generate concierge response.' }, { status: 500 });
  }
}
