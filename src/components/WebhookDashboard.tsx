'use client';

import { useState } from 'react';
import EventList from './EventList';
import CopyButton from './CopyButton';

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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        View Your Webhooks
      </h2>

      <form onSubmit={handleRetrieve} className="mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn Client ID
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-linkedin focus:border-transparent transition-all"
              placeholder="Enter your LinkedIn app client ID"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-linkedin text-white py-2.5 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-medium"
            >
              {loading ? 'Loading...' : 'Retrieve'}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">{error}</p>
        </div>
      )}

      {webhooks.length > 0 && (
        <div className="space-y-4">
          <div className="pb-3 border-b border-gray-200">
            <p className="text-sm text-gray-600">
              {webhooks.length} / 3 webhook{webhooks.length !== 1 ? 's' : ''} created
            </p>
          </div>

          {webhooks.map((webhook) => (
            <div
              key={webhook.id}
              className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1.5">Webhook Path:</p>
                  <code className="text-sm bg-gray-50 px-3 py-1.5 rounded-lg font-mono">
                    {webhook.webhookPath}
                  </code>
                </div>
                <button
                  onClick={() => handleDelete(webhook.id)}
                  className="ml-3 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm text-gray-500">Full URL:</p>
                  <CopyButton key={`copy-${webhook.id}`} text={webhook.webhookUrl} />
                </div>
                <code className="block text-xs bg-gray-50 p-3 rounded-lg overflow-x-auto font-mono text-gray-700">
                  {webhook.webhookUrl}
                </code>
              </div>

              <button
                onClick={() =>
                  setSelectedWebhookId(
                    selectedWebhookId === webhook.id ? null : webhook.id
                  )
                }
                className="text-linkedin hover:text-blue-700 text-sm font-medium transition-colors"
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
