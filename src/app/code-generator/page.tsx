'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CodeGenerator from '@/components/CodeGenerator';

function CodeGeneratorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [clientId, setClientId] = useState('');
  const [inputClientId, setInputClientId] = useState('');

  useEffect(() => {
    const clientIdFromUrl = searchParams.get('clientId');
    if (clientIdFromUrl) {
      setClientId(clientIdFromUrl);
      setInputClientId(clientIdFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputClientId.trim()) {
      router.push(`/code-generator?clientId=${encodeURIComponent(inputClientId)}`);
      setClientId(inputClientId);
    }
  };

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-linkedin hover:underline mb-4 inline-flex items-center"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Code Generator
          </h1>
          <p className="text-gray-600">
            Generate a standalone Node.js webhook server with correct LinkedIn signature validation
          </p>
        </div>

        {/* Client ID Input Form */}
        {!clientId && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Enter LinkedIn Client ID
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Client ID *
                </label>
                <input
                  type="text"
                  value={inputClientId}
                  onChange={(e) => setInputClientId(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-linkedin focus:border-transparent transition-all"
                  placeholder="Enter your LinkedIn app client ID"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-linkedin text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-all font-medium"
              >
                Generate Code
              </button>
            </form>
          </div>
        )}

        {/* Code Generator Component */}
        {clientId && <CodeGenerator clientId={clientId} />}

        {/* Change Client ID */}
        {clientId && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setClientId('');
                setInputClientId('');
                router.push('/code-generator');
              }}
              className="text-sm text-gray-600 hover:text-linkedin hover:underline"
            >
              Use a different Client ID
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function CodeGeneratorPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </main>
    }>
      <CodeGeneratorContent />
    </Suspense>
  );
}
