import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { webhookId: string } }
) {
  try {
    const { webhookId } = params;

    if (!webhookId) {
      return NextResponse.json(
        { success: false, error: 'Webhook ID is required' },
        { status: 400 }
      );
    }

    // Fetch events for this webhook, ordered by newest first
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('webhook_id', webhookId)
      .order('received_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching events:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch events' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, events: events || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in events API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
