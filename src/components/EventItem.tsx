'use client';

import { useState } from 'react';
import { WebhookEvent } from '@/lib/types';

interface EventItemProps {
  event: WebhookEvent;
}

export default function EventItem({ event }: EventItemProps) {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getEventTypeColor = (type: string) => {
    return type === 'challenge'
      ? 'bg-blue-100 text-blue-800 border-blue-300'
      : 'bg-green-100 text-green-800 border-green-300';
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-lg">
            {expanded ? '▼' : '▶'}
          </span>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`px-2 py-1 rounded text-xs font-medium border ${getEventTypeColor(
                  event.event_type
                )}`}
              >
                {event.event_type.toUpperCase()}
              </span>
              <span className="text-sm text-gray-500">
                {formatDate(event.received_at)}
              </span>
            </div>
            {!expanded && (
              <p className="text-sm text-gray-600">
                Click to view details
              </p>
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-300 p-4 bg-gray-50">
          <div className="space-y-4">
            {/* Headers Section */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Headers
              </h4>
              <div className="bg-white p-3 rounded border border-gray-200 overflow-x-auto">
                <pre className="text-xs">
                  {JSON.stringify(event.headers, null, 2)}
                </pre>
              </div>
            </div>

            {/* Payload Section */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Payload
              </h4>
              <div className="bg-white p-3 rounded border border-gray-200 overflow-x-auto">
                <pre className="text-xs">
                  {JSON.stringify(event.payload, null, 2)}
                </pre>
              </div>
            </div>

            {/* Event Type Specific Info */}
            {event.event_type === 'challenge' && (
              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Challenge Validation:</strong> This is a validation
                  request from LinkedIn. The challenge code was automatically
                  returned to verify this webhook endpoint.
                </p>
              </div>
            )}

            {event.event_type === 'notification' && (
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>Event Notification:</strong> This is an actual event
                  notification from LinkedIn. The signature was verified before
                  storing.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
