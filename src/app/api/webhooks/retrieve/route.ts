import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { RetrieveWebhooksResponse } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json<RetrieveWebhooksResponse>(
        { success: false, error: 'Client ID is required' },
        { status: 400 }
      );
    }

    // Fetch webhooks for the client
    const { data: webhooks, error } = await supabase
      .from('webhooks')
      .select('id, webhook_path, created_at')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error retrieving webhooks:', error);
      return NextResponse.json<RetrieveWebhooksResponse>(
        { success: false, error: 'Failed to retrieve webhooks' },
        { status: 500 }
      );
    }

    // Update last_accessed_at for all webhooks
    if (webhooks && webhooks.length > 0) {
      const webhookIds = webhooks.map(w => w.id);
      await supabase
        .from('webhooks')
        .update({ last_accessed_at: new Date().toISOString() })
        .in('id', webhookIds);
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    return NextResponse.json<RetrieveWebhooksResponse>(
      {
        success: true,
        webhooks: webhooks?.map(w => ({
          id: w.id,
          webhookUrl: `${baseUrl}/api/linkedin-webhook/${w.webhook_path}`,
          webhookPath: w.webhook_path,
          createdAt: w.created_at,
        })) || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in retrieve webhooks API:', error);
    return NextResponse.json<RetrieveWebhooksResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
