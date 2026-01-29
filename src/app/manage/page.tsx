'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import CopyButton from '@/components/CopyButton';

interface Webhook {
  id: string;
  webhookUrl: string;
  webhookPath: string;
  createdAt: string;
}

function ManagePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [clientId, setClientId] = useState('');
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load client ID from URL on mount
  useEffect(() => {
    const clientIdFromUrl = searchParams.get('clientId');
    if (clientIdFromUrl) {
      setClientId(clientIdFromUrl);
      // Auto-retrieve if client ID is in URL
      fetchWebhooks(clientIdFromUrl);
    }
  }, []);

  const fetchWebhooks = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/webhooks/retrieve?clientId=${encodeURIComponent(id)}`
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

  const handleRetrieve = async (e: React.FormEvent) => {
    e.preventDefault();

    // Update URL with client ID
    router.push(`/manage?clientId=${encodeURIComponent(clientId)}`);

    await fetchWebhooks(clientId);
  };

  const handleDelete = async (webhookId: string) => {
    if (!confirm('Are you sure you want to delete this webhook? All associated events will also be deleted.')) {
      return;
    }

    try {
      const response = await fetch(`/api/webhooks/delete/${webhookId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setWebhooks(webhooks.filter((w) => w.id !== webhookId));
      } else {
        alert('Failed to delete webhook: ' + data.error);
      }
    } catch (err) {
      alert('Failed to delete webhook. Please try again.');
    }
  };

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manage Webhooks
          </h1>
          <p className="text-gray-600">
            Enter your LinkedIn Client ID to view and manage your webhooks.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleRetrieve} className="space-y-4">
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
        </div>

        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800">{error}</p>
          </div>
        )}

        {webhooks.length > 0 && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-sm text-gray-600">
                {webhooks.length} / 3 webhook{webhooks.length !== 1 ? 's' : ''}{' '}
                created
              </p>
            </div>

            {webhooks.map((webhook) => (
              <div
                key={webhook.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Webhook Path:</p>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {webhook.webhookPath}
                    </code>
                    <p className="text-xs text-gray-400 mt-2">
                      Created: {new Date(webhook.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(webhook.id)}
                    className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-gray-500">Full URL:</p>
                    <CopyButton key={`copy-${webhook.id}`} text={webhook.webhookUrl} />
                  </div>
                  <code className="block text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                    {webhook.webhookUrl}
                  </code>
                </div>

                <Link
                  href={`/webhook/${webhook.id}`}
                  className="inline-block bg-linkedin text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  View Events →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function ManagePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </main>
    }>
      <ManagePageContent />
    </Suspense>
  );
}
