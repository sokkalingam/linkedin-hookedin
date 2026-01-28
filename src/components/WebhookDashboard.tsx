'use client';

import { useState } from 'react';
import EventList from './EventList';

interface Webhook {
  id: string;
  webhookUrl: string;
  webhookPath: string;
  createdAt: string;
}

export default function WebhookDashboard() {
  const [clientId, setClientId] = useState('');
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedWebhookId, setSelectedWebhookId] = useState<string | null>(null);

  const handleRetrieve = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSelectedWebhookId(null);

    try {
      const response = await fetch(
        `/api/webhooks/retrieve?clientId=${encodeURIComponent(clientId)}`
      );
      const data = await response.json();

      if (data.success) {
        setWebhooks(data.webhooks || []);
        if (data.webhooks?.length === 0) {
          setError('No webhooks found for this client ID');
        }
      } else {
        setError(data.error || 'Failed to retrieve webhooks');
        setWebhooks([]);
      }
    } catch (err) {
      setError('Failed to retrieve webhooks. Please try again.');
      setWebhooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (webhookId: string) => {
    if (!confirm('Are you sure you want to delete this webhook?')) {
      return;
    }

    try {
      const response = await fetch(`/api/webhooks/delete/${webhookId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setWebhooks(webhooks.filter((w) => w.id !== webhookId));
        if (selectedWebhookId === webhookId) {
          setSelectedWebhookId(null);
        }
      } else {
        alert('Failed to delete webhook: ' + data.error);
      }
    } catch (err) {
      alert('Failed to delete webhook. Please try again.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        View Your Webhooks
      </h2>

      <form onSubmit={handleRetrieve} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn Client ID
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin"
              placeholder="Enter your LinkedIn app client ID"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-linkedin text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Loading...' : 'Retrieve'}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800">{error}</p>
        </div>
      )}

      {webhooks.length > 0 && (
        <div className="space-y-4">
          <div className="border-b pb-2">
            <p className="text-sm text-gray-600">
              {webhooks.length} / 3 webhook{webhooks.length !== 1 ? 's' : ''}{' '}
              created
            </p>
          </div>

          {webhooks.map((webhook) => (
            <div
              key={webhook.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Webhook Path:</p>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {webhook.webhookPath}
                  </code>
                </div>
                <button
                  onClick={() => handleDelete(webhook.id)}
                  className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-500 mb-1">Full URL:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                    {webhook.webhookUrl}
                  </code>
                  <button
                    onClick={() => copyToClipboard(webhook.webhookUrl)}
                    className="px-3 py-1 bg-linkedin text-white rounded hover:bg-blue-700 text-sm whitespace-nowrap"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <button
                onClick={() =>
                  setSelectedWebhookId(
                    selectedWebhookId === webhook.id ? null : webhook.id
                  )
                }
                className="text-linkedin hover:text-blue-700 text-sm font-medium"
              >
                {selectedWebhookId === webhook.id
                  ? '▼ Hide Events'
                  : '▶ View Events'}
              </button>

              {selectedWebhookId === webhook.id && (
                <div className="mt-4">
                  <EventList webhookId={webhook.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
