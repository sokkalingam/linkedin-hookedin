'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { WebhookEvent } from '@/lib/types';

interface Webhook {
  id: string;
  webhookUrl: string;
  webhookPath: string;
  createdAt: string;
  clientId: string;
}

interface AnalyticsData {
  totalEvents: number;
  challengeEvents: number;
  notificationEvents: number;
  validSignatures: number;
  invalidSignatures: number;
  noSignatures: number;
  latestEventTime: string | null;
  webhookAge: number;
  healthScore: number;
}

type TimeRange = '1day' | '7days' | '30days';

export default function WebhookAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const webhookId = params.id as string;

  const [webhook, setWebhook] = useState<Webhook | null>(null);
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('7days');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

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
      setError('Failed to load webhook details');
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch(`/api/events/${webhookId}`);
      const data = await response.json();

      if (data.success) {
        setEvents(data.events || []);
        computeAnalytics(data.events || []);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch events');
      }
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const computeAnalytics = (eventList: WebhookEvent[]) => {
    const challengeEvents = eventList.filter((e) => e.event_type === 'challenge').length;
    const notificationEvents = eventList.filter((e) => e.event_type === 'notification').length;

    // Only count validation status for notification events
    const notificationEventsList = eventList.filter((e) => e.event_type === 'notification');
    const validSignatures = notificationEventsList.filter((e) => e.validation_status === 'valid').length;
    const invalidSignatures = notificationEventsList.filter((e) => e.validation_status === 'invalid').length;
    const noSignatures = notificationEventsList.filter((e) => e.validation_status === 'no_signature').length;

    const latestEvent = eventList.length > 0 ? eventList[0].received_at : null;

    const webhookAge = webhook
      ? Math.floor((Date.now() - new Date(webhook.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    // Health score: Only calculate if there are notification events
    // Cap at 100% maximum
    let healthScore = 100;
    if (notificationEvents > 0) {
      healthScore = Math.min(100, Math.round((validSignatures / notificationEvents) * 100));
    } else {
      healthScore = -1; // Use -1 to indicate N/A
    }

    setAnalytics({
      totalEvents: eventList.length,
      challengeEvents,
      notificationEvents,
      validSignatures,
      invalidSignatures,
      noSignatures,
      latestEventTime: latestEvent,
      webhookAge,
      healthScore,
    });
  };

  useEffect(() => {
    if (webhookId) {
      fetchWebhookDetails();
      fetchEvents();
    }
  }, [webhookId]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchEvents();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, webhookId]);

  // Compute time-series data for line chart
  const getTimeSeriesData = () => {
    if (events.length === 0) return [];

    const now = Date.now();
    const ranges = {
      '1day': 24 * 60 * 60 * 1000,
      '7days': 7 * 24 * 60 * 60 * 1000,
      '30days': 30 * 24 * 60 * 60 * 1000,
    };

    const rangeMs = ranges[timeRange];
    const filteredEvents = events.filter(
      (e) => now - new Date(e.received_at).getTime() <= rangeMs
    );

    // Group events by date with timestamp for sorting
    const eventsByDate: { [key: string]: { challenge: number; notification: number; timestamp: number } } = {};

    filteredEvents.forEach((event) => {
      const eventDate = new Date(event.received_at);
      const dateKey = eventDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      if (!eventsByDate[dateKey]) {
        eventsByDate[dateKey] = {
          challenge: 0,
          notification: 0,
          timestamp: eventDate.getTime()
        };
      }

      if (event.event_type === 'challenge') {
        eventsByDate[dateKey].challenge++;
      } else {
        eventsByDate[dateKey].notification++;
      }
    });

    // Convert to array format for Recharts and sort by timestamp (oldest to newest)
    return Object.entries(eventsByDate)
      .map(([date, data]) => ({
        date,
        Challenge: data.challenge,
        Notification: data.notification,
        timestamp: data.timestamp,
      }))
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(({ date, Challenge, Notification }) => ({ date, Challenge, Notification }));
  };

  // Event type breakdown data for pie chart
  const getEventTypeData = () => {
    if (!analytics) return [];
    return [
      { name: 'Challenge', value: analytics.challengeEvents, color: '#0A66C2' },
      { name: 'Notification', value: analytics.notificationEvents, color: '#10B981' },
    ];
  };

  // Signature validation data for bar chart
  const getSignatureData = () => {
    if (!analytics) return [];
    return [
      { name: 'Valid', count: analytics.validSignatures, color: '#10B981' },
      { name: 'Invalid', count: analytics.invalidSignatures, color: '#EF4444' },
      { name: 'No Signature', count: analytics.noSignatures, color: '#F59E0B' },
    ];
  };

  const formatTimeSince = (timestamp: string | null) => {
    if (!timestamp) return 'Never';

    const diff = Date.now() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <main className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading analytics...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !webhook || !analytics) {
    return (
      <main className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800">{error || 'Failed to load analytics'}</p>
            <button
              onClick={() => router.push(`/webhook/${webhookId}`)}
              className="mt-4 text-linkedin hover:underline"
            >
              ← Back to Webhook Details
            </button>
          </div>
        </div>
      </main>
    );
  }

  const timeSeriesData = getTimeSeriesData();
  const eventTypeData = getEventTypeData();
  const signatureData = getSignatureData();

  return (
    <main className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <Link
              href={`/webhook/${webhookId}`}
              className="text-linkedin hover:underline inline-flex items-center"
            >
              ← Back to Webhook Details
            </Link>
            <Link
              href={`/manage?clientId=${encodeURIComponent(webhook.clientId)}`}
              className="text-linkedin hover:underline inline-flex items-center"
            >
              ← Back to Manage Webhooks
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                📊 Webhook Analytics
              </h1>
              <p className="text-gray-600">
                Performance metrics and insights for {webhook.webhookPath}
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm bg-white px-4 py-2 rounded-lg border border-gray-200">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-gray-300 text-linkedin focus:ring-linkedin"
              />
              <span className="text-gray-700">Auto-refresh (10s)</span>
            </label>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Events</span>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{analytics.totalEvents}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Challenge Events</span>
              <span className="text-2xl">🔷</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">{analytics.challengeEvents}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Notification Events</span>
              <span className="text-2xl">📨</span>
            </div>
            <p className="text-3xl font-bold text-green-600">{analytics.notificationEvents}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Invalid Signatures</span>
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-3xl font-bold text-red-600">{analytics.invalidSignatures}</p>
          </div>
        </div>

        {/* Events Over Time Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Events Over Time</h2>
            <div className="flex gap-2">
              {(['1day', '7days', '30days'] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    timeRange === range
                      ? 'bg-linkedin text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {range === '1day' ? '1 Day' : range === '7days' ? '7 Days' : '30 Days'}
                </button>
              ))}
            </div>
          </div>

          {timeSeriesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Challenge"
                  stroke="#0A66C2"
                  strokeWidth={2}
                  dot={{ fill: '#0A66C2', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="Notification"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: '#10B981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No events in the selected time range
            </div>
          )}
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Charts */}
          <div className="space-y-8">
            {/* Event Type Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Event Type Breakdown</h2>
              {eventTypeData.some((d) => d.value > 0) ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={eventTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {eventTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-gray-500">No events yet</div>
              )}
            </div>

            {/* Signature Validation Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Signature Validation Status
              </h2>
              {signatureData.some((d) => d.count > 0) ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={signatureData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" stroke="#6B7280" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {signatureData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-gray-500">No signature data</div>
              )}
            </div>
          </div>

          {/* Right Column - Activity Card */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>

              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <p className="text-sm text-gray-600 mb-2">Latest Event</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {analytics.latestEventTime
                      ? new Date(analytics.latestEventTime).toLocaleString()
                      : 'No events yet'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatTimeSince(analytics.latestEventTime)}
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <p className="text-sm text-gray-600 mb-2">Webhook Age</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {analytics.webhookAge} day{analytics.webhookAge !== 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Created on {new Date(webhook.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <p className="text-sm text-gray-600 mb-2">Last Active</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatTimeSince(analytics.latestEventTime)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Health Score</p>
                  {analytics.healthScore >= 0 ? (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all ${
                              analytics.healthScore >= 90
                                ? 'bg-green-500'
                                : analytics.healthScore >= 70
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, analytics.healthScore)}%` }}
                          />
                        </div>
                        <span className="text-2xl font-bold text-gray-900">
                          {analytics.healthScore}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {analytics.healthScore === 100
                          ? 'Perfect! All signatures are valid.'
                          : analytics.healthScore >= 90
                          ? 'Great! Most signatures are valid.'
                          : analytics.healthScore >= 70
                          ? 'Good, but some signatures are invalid.'
                          : 'Warning: Many invalid signatures detected.'}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-gray-500">N/A</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        No notification events to validate yet.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
              <h3 className="text-sm font-semibold text-blue-900 mb-4">Quick Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-800">Valid Signatures:</span>
                  <span className="font-semibold text-green-700">{analytics.validSignatures}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-800">Invalid Signatures:</span>
                  <span className="font-semibold text-red-700">{analytics.invalidSignatures}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-800">No Signature:</span>
                  <span className="font-semibold text-yellow-700">{analytics.noSignatures}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-blue-300">
                  <span className="text-blue-800 font-medium">Total Notifications:</span>
                  <span className="font-semibold text-blue-900">{analytics.notificationEvents}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
