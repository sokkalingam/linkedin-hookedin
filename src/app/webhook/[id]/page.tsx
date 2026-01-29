'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import EventList from '@/components/EventList';
import CopyButton from '@/components/CopyButton';

interface Webhook {
  id: string;
  webhookUrl: string;
  webhookPath: string;
  createdAt: string;
  clientId: string;
}

export default function WebhookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const webhookId = params.id as string;

  const [webhook, setWebhook] = useState<Webhook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWebhookDetails = async () => {
      try {
        const response = await fetch(`/api/webhooks/${webhookId}`);
        const data = await response.json();

        if (data.success) {
          setWebhook(data.webhook);
        } else {
          setError(data.error || 'Failed to load webhook details');
        }
      } catch (err) {
        setError('Failed to load webhook details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (webhookId) {
      fetchWebhookDetails();
    }
  }, [webhookId]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this webhook? All associated events will also be deleted.')) {
      return;
    }

    try {
      const response = await fetch(`/api/webhooks/delete/${webhookId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        router.push('/manage');
      } else {
        alert('Failed to delete webhook: ' + data.error);
      }
    } catch (err) {
      alert('Failed to delete webhook. Please try again.');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading webhook details...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !webhook) {
    return (
      <main className="min-h-screen py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800">{error || 'Webhook not found'}</p>
            <button
              onClick={() => router.push('/manage')}
              className="mt-4 text-linkedin hover:underline"
            >
              ← Back to Manage Webhooks
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push('/manage')}
            className="text-linkedin hover:underline mb-4 inline-flex items-center"
          >
            ← Back to Manage Webhooks
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Webhook Details
          </h1>
          <p className="text-gray-600">
            Monitor events and manage your webhook endpoint.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Webhook Information
              </h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Webhook Path:</p>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {webhook.webhookPath}
                  </code>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Client ID:</p>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {webhook.clientId}
                  </code>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Created:</p>
                  <p className="text-sm text-gray-700">
                    {new Date(webhook.createdAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-gray-500">Full URL:</p>
                    <CopyButton text={webhook.webhookUrl} />
                  </div>
                  <code className="block text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                    {webhook.webhookUrl}
                  </code>
                </div>
              </div>
            </div>

            <button
              onClick={handleDelete}
              className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              Delete Webhook
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <EventList webhookId={webhookId} />
        </div>
      </div>
    </main>
  );
}
