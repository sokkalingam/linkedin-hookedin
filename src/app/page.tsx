import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-7xl font-semibold text-gray-900 mb-6">
            🎣 HookedIn
          </h1>
          <p className="text-2xl text-gray-600 mb-2">
            Test LinkedIn webhooks instantly.
          </p>
          <p className="text-lg text-gray-400">
            Create endpoints. Receive events. Validate.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">
            How it works
          </h2>
          <ol className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="font-semibold text-linkedin mr-3">1</span>
              <span>Enter LinkedIn app credentials</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-linkedin mr-3">2</span>
              <span>Copy generated webhook URL</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-linkedin mr-3">3</span>
              <span>Add URL to LinkedIn Developer App</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-linkedin mr-3">4</span>
              <span>View events in real-time</span>
            </li>
          </ol>
          <p className="mt-6 text-sm text-gray-500">
            Up to 3 webhooks per client. Auto-expires after 30 days of inactivity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <Link
            href="/create"
            className="group bg-white border border-gray-200 rounded-2xl p-8 hover:border-linkedin hover:shadow-lg transition-all"
          >
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              Create Webhook
            </h3>
            <p className="text-gray-500 text-sm">
              Generate endpoint instantly
            </p>
          </Link>

          <Link
            href="/manage"
            className="group bg-white border border-gray-200 rounded-2xl p-8 hover:border-linkedin hover:shadow-lg transition-all"
          >
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              Manage Webhooks
            </h3>
            <p className="text-gray-500 text-sm">
              View events in real-time
            </p>
          </Link>
        </div>

        <div className="text-center text-sm text-gray-400">
          <p>
            Encrypted. Secure. Auto-expires.
          </p>
          <p className="mt-2">
            <a
              href="https://learn.microsoft.com/en-us/linkedin/shared/api-guide/webhook-validation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-linkedin hover:text-blue-700 transition-colors"
            >
              LinkedIn Webhook Docs
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
