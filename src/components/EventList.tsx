'use client';

import { useState, useEffect } from 'react';
import EventItem from './EventItem';
import { WebhookEvent } from '@/lib/types';

interface EventListProps {
  webhookId: string;
}

export default function EventList({ webhookId }: EventListProps) {
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`/api/events/${webhookId}`);
      const data = await response.json();

      if (data.success) {
        setEvents(data.events || []);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch events');
      }
    } catch (err) {
      setError('Failed to fetch events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [webhookId]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchEvents();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, webhookId]);

  const handleManualRefresh = () => {
    setLoading(true);
    fetchEvents();
  };

  if (loading && events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">Loading events...</div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Events ({events.length})
          </h3>
          <button
            onClick={handleManualRefresh}
            disabled={loading}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 text-sm"
          >
            {loading ? '↻ Refreshing...' : '↻ Refresh'}
          </button>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="rounded border-gray-300 text-linkedin focus:ring-linkedin"
          />
          <span className="text-gray-700">Auto-refresh (5s)</span>
        </label>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg">
          <p>No events received yet.</p>
          <p className="text-sm mt-2">
            Configure this webhook URL in your LinkedIn Developer App to start
            receiving events.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <EventItem key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
