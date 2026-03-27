'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';

import { Card } from '@/components/ui/card';
import type { PlaceRecord } from '@/lib/types';

type ConciergeApiResponse = {
  answer: string;
  suggestedPlaces: PlaceRecord[];
  suggestedEvents: Array<{ id: string; title: string }>;
  disclaimers?: string[];
};

export function ConciergePanel() {
  const [message, setMessage] = useState('What should I do this afternoon near Red Hook?');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConciergeApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAsk() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/concierge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          island: 'st_thomas',
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Concierge request failed.');
      }

      const json = (await response.json()) as ConciergeApiResponse;
      setResult(json);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unable to get concierge response.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-200">
          <Sparkles className="h-5 w-5" />
        </div>

        <div>
          <div className="text-lg font-semibold">AI concierge</div>
          <p className="mt-1 text-sm text-slate-300">Ground responses in your live island data, not generic chat.</p>
        </div>
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none"
      />

      <button
        onClick={handleAsk}
        disabled={loading}
        className="rounded-2xl bg-cyan-400/15 px-4 py-3 text-sm font-medium text-cyan-200 disabled:opacity-50"
      >
        {loading ? 'Thinking...' : 'Ask concierge'}
      </button>

      {error ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</div>
      ) : null}

      {result ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-slate-200">
            {result.answer}
          </div>

          {result.suggestedPlaces.length > 0 ? (
            <div>
              <div className="mb-2 text-sm font-semibold text-white">Suggested places</div>
              <div className="space-y-2">
                {result.suggestedPlaces.map((place) => (
                  <div key={place.id} className="rounded-2xl bg-white/5 px-3 py-3 text-sm text-slate-200">
                    <div className="font-medium text-white">{place.name}</div>
                    <div className="mt-1 text-slate-300">{place.shortDescription ?? place.description}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {result.disclaimers?.length ? (
            <div className="space-y-2">
              {result.disclaimers.map((item) => (
                <div key={item} className="text-xs text-slate-400">
                  {item}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
