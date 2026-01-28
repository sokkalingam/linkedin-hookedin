import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const webhookId = params.id;

    if (!webhookId) {
      return NextResponse.json(
        { success: false, error: 'Webhook ID is required' },
        { status: 400 }
      );
    }

    const { data: webhook, error } = await supabase
      .from('webhooks')
      .select('id, client_id, webhook_path, created_at')
      .eq('id', webhookId)
      .single();

    if (error || !webhook) {
      console.error('Error retrieving webhook:', error);
      return NextResponse.json(
        { success: false, error: 'Webhook not found' },
        { status: 404 }
      );
    }

    await supabase
      .from('webhooks')
      .update({ last_accessed_at: new Date().toISOString() })
      .eq('id', webhookId);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    return NextResponse.json(
      {
        success: true,
        webhook: {
          id: webhook.id,
          clientId: webhook.client_id,
          webhookUrl: `${baseUrl}/api/linkedin-webhook/${webhook.webhook_path}`,
          webhookPath: webhook.webhook_path,
          createdAt: webhook.created_at,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in get webhook API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
