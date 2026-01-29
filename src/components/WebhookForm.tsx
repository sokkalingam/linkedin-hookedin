'use client';

import { useState } from 'react';
import { CreateWebhookResponse } from '@/lib/types';
import CopyButton from './CopyButton';

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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Create Webhook
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client ID
          </label>
          <input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-linkedin focus:border-transparent transition-all"
            placeholder="LinkedIn Client ID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client Secret
          </label>
          <input
            type="password"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-linkedin focus:border-transparent transition-all"
            placeholder="LinkedIn Client Secret"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 mb-2.5">
            <input
              type="checkbox"
              checked={useCustomPath}
              onChange={(e) => setUseCustomPath(e.target.checked)}
              className="rounded border-gray-300 text-linkedin focus:ring-linkedin"
            />
            <span className="text-sm font-medium text-gray-700">
              Custom path
            </span>
          </label>

          {useCustomPath && (
            <input
              type="text"
              value={customPath}
              onChange={(e) => setCustomPath(e.target.value.toLowerCase())}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-linkedin focus:border-transparent transition-all"
              placeholder="my-webhook-path"
              pattern="[a-z0-9-]{3,50}"
            />
          )}
          {!useCustomPath && (
            <p className="text-sm text-gray-400">
              Random path auto-generated
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-linkedin text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-medium"
        >
          {loading ? 'Creating...' : 'Create Webhook'}
        </button>
      </form>

      {result && (
        <div
          className={`mt-6 p-5 rounded-lg ${
            result.success
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          {result.success ? (
            <div>
              <p className="text-green-800 font-medium mb-3">
                ✓ Webhook created
              </p>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500">Webhook URL</p>
                  <CopyButton text={result.webhookUrl!} />
                </div>
                <code className="block text-sm bg-gray-50 p-3 rounded-lg overflow-x-auto font-mono text-gray-700">
                  {result.webhookUrl}
                </code>
              </div>
            </div>
          ) : (
            <p className="text-sm text-red-800">✗ {result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
