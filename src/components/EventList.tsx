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
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-gray-900">
            Events ({events.length})
          </h3>
          <button
            onClick={handleManualRefresh}
            disabled={loading}
            className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50 text-sm font-medium transition-colors"
          >
            {loading ? '↻' : '↻'}
          </button>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="rounded border-gray-300 text-linkedin focus:ring-linkedin"
          />
          <span className="text-gray-500">Auto (5s)</span>
        </label>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12 text-gray-400 border border-gray-200 rounded-xl bg-gray-50/50">
          <p className="text-sm">No events yet</p>
          <p className="text-xs mt-1.5 text-gray-400">
            Configure webhook in LinkedIn Developer Portal
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
