'use client';

import { useState } from 'react';
import { CreateWebhookResponse } from '@/lib/types';

export default function WebhookForm() {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [customPath, setCustomPath] = useState('');
  const [useCustomPath, setUseCustomPath] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CreateWebhookResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/webhooks/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          clientSecret,
          customPath: useCustomPath ? customPath : undefined,
        }),
      });

      const data: CreateWebhookResponse = await response.json();
      setResult(data);

      if (data.success) {
        setClientId('');
        setClientSecret('');
        setCustomPath('');
        setUseCustomPath(false);
      }
    } catch (error) {
      setResult({
        success: false,
        error: 'Failed to create webhook. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Create New Webhook
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn Client ID *
          </label>
          <input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin"
            placeholder="Enter your LinkedIn app client ID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn Client Secret *
          </label>
          <input
            type="password"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin"
            placeholder="Enter your LinkedIn app client secret"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={useCustomPath}
              onChange={(e) => setUseCustomPath(e.target.checked)}
              className="rounded border-gray-300 text-linkedin focus:ring-linkedin"
            />
            <span className="text-sm font-medium text-gray-700">
              Use custom webhook path
            </span>
          </label>

          {useCustomPath && (
            <input
              type="text"
              value={customPath}
              onChange={(e) => setCustomPath(e.target.value.toLowerCase())}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin"
              placeholder="dancing-orange (lowercase, alphanumeric, hyphens)"
              pattern="[a-z0-9-]{3,50}"
            />
          )}
          {!useCustomPath && (
            <p className="text-sm text-gray-500">
              A random path will be generated (e.g., dancing-orange-123)
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-linkedin text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Creating...' : 'Create Webhook'}
        </button>
      </form>

      {result && (
        <div
          className={`mt-4 p-4 rounded-md ${
            result.success
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          {result.success ? (
            <div>
              <p className="text-green-800 font-medium mb-2">
                ✓ Webhook created successfully!
              </p>
              <div className="bg-white p-3 rounded border border-green-300">
                <p className="text-sm text-gray-600 mb-1">Your webhook URL:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm bg-gray-100 p-2 rounded overflow-x-auto">
                    {result.webhookUrl}
                  </code>
                  <button
                    onClick={() => copyToClipboard(result.webhookUrl!)}
                    className="px-3 py-1 bg-linkedin text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-red-800">✗ {result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
