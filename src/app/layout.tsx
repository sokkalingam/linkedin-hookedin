import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'HookedIn - LinkedIn Webhook Testing',
  description: 'Get HookedIn. The fastest way to test LinkedIn webhooks. Spin up endpoints, receive events, validate integrations—all in one place.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
