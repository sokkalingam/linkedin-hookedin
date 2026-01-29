import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-7xl font-semibold text-gray-900 mb-6">
            🎣 HookedIn
          </h1>
          <p className="text-2xl text-gray-600 mb-3">
            Get HookedIn. The fastest way to test LinkedIn webhooks.
          </p>
          <p className="text-lg text-gray-500">
            Spin up endpoints, receive events, validate integrations—all in one place.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-5">
            How it works
          </h2>
          <ol className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="font-semibold text-linkedin mr-3">1.</span>
              <span>Create a webhook by entering your LinkedIn app credentials</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-linkedin mr-3">2.</span>
              <span>Copy the generated webhook URL</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-linkedin mr-3">3.</span>
              <span>Add the URL to your LinkedIn Developer App webhook settings</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-linkedin mr-3">4.</span>
              <span>View incoming events in real-time (challenge validations and notifications)</span>
            </li>
          </ol>
          <p className="mt-6 text-sm text-gray-600">
            <strong>Note:</strong> You can create up to 3 webhooks per client ID. Webhooks unused for 30+ days will automatically expire.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <Link
            href="/create"
            className="group bg-white border border-gray-200 rounded-2xl p-8 hover:border-linkedin hover:shadow-lg transition-all"
          >
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-900">
              Create Webhook
            </h3>
            <p className="text-gray-600">
              Generate a new webhook URL for your LinkedIn app. Enter your
              client credentials and get started instantly.
            </p>
          </Link>

          <Link
            href="/manage"
            className="group bg-white border border-gray-200 rounded-2xl p-8 hover:border-linkedin hover:shadow-lg transition-all"
          >
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-900">
              Manage Webhooks
            </h3>
            <p className="text-gray-600">
              View and manage your existing webhooks. Monitor incoming events
              and challenge validations in real-time.
            </p>
          </Link>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>
            Built for LinkedIn webhook testing. Data is encrypted and stored securely.
          </p>
          <p className="mt-2">
            Learn more about{' '}
            <a
              href="https://learn.microsoft.com/en-us/linkedin/shared/api-guide/webhook-validation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-linkedin hover:text-blue-700 transition-colors"
            >
              LinkedIn Webhook Validation
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
