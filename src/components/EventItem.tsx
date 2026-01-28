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

  const getValidationStatusColor = (status?: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'invalid':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'no_signature':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getValidationStatusLabel = (status?: string) => {
    switch (status) {
      case 'valid':
        return '✓ Valid';
      case 'invalid':
        return '✗ Invalid Signature';
      case 'no_signature':
        return '⚠ No Signature';
      default:
        return 'Unknown';
    }
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
              {event.validation_status && event.event_type === 'notification' && (
                <span
                  className={`px-2 py-1 rounded text-xs font-medium border ${getValidationStatusColor(
                    event.validation_status
                  )}`}
                >
                  {getValidationStatusLabel(event.validation_status)}
                </span>
              )}
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
              <div
                className={`p-3 rounded border ${
                  event.validation_status === 'invalid'
                    ? 'bg-red-50 border-red-200'
                    : event.validation_status === 'no_signature'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-green-50 border-green-200'
                }`}
              >
                <p
                  className={`text-sm ${
                    event.validation_status === 'invalid'
                      ? 'text-red-800'
                      : event.validation_status === 'no_signature'
                      ? 'text-yellow-800'
                      : 'text-green-800'
                  }`}
                >
                  <strong>Event Notification:</strong>{' '}
                  {event.validation_status === 'invalid' && (
                    'Signature validation FAILED. This event may not be from LinkedIn.'
                  )}
                  {event.validation_status === 'no_signature' && (
                    'No signature provided. Unable to verify authenticity.'
                  )}
                  {event.validation_status === 'valid' && (
                    'Signature verified successfully. This event is from LinkedIn.'
                  )}
                  {!event.validation_status && (
                    'This is an actual event notification from LinkedIn.'
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
