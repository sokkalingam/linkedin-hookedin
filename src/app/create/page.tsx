import WebhookForm from '@/components/WebhookForm';

export default function CreatePage() {
  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Webhook
          </h1>
          <p className="text-gray-600">
            Generate a unique webhook URL for your LinkedIn app. Enter your
            client credentials below.
          </p>
        </div>

        <WebhookForm />

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Next Steps
          </h3>
          <ol className="space-y-2 text-blue-800 text-sm">
            <li>1. Copy the generated webhook URL</li>
            <li>2. Go to your LinkedIn Developer App settings</li>
            <li>3. Navigate to Products → Webhooks section</li>
            <li>4. Paste the webhook URL and save</li>
            <li>5. LinkedIn will send a challenge request to validate</li>
            <li>6. View events in the Manage Webhooks page</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
