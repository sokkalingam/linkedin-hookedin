import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { decryptSecret } from '@/lib/encryption';
import { validateLinkedInSignature, handleChallenge } from '@/lib/webhook-validator';

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string } }
) {
  try {
    const { path } = params;

    // Get request body as text for signature validation
    const bodyText = await request.text();
    let body: any;
    
    try {
      body = JSON.parse(bodyText);
    } catch (e) {
      body = {};
    }

    console.log('LinkedIn webhook POST received:', { path, body });

    // Check if this is a challenge request - respond immediately without DB lookup
    if (body.challenge) {
      console.log('Challenge request detected, responding with:', body.challenge);
      
      // Store challenge event asynchronously (don't block response)
      supabase
        .from('webhooks')
        .select('id')
        .eq('webhook_path', path)
        .single()
        .then(({ data: webhook }) => {
          if (webhook) {
            const headers: Record<string, string> = {};
            request.headers.forEach((value, key) => {
              headers[key] = value;
            });
            
            return supabase.from('events').insert({
              webhook_id: webhook.id,
              event_type: 'challenge',
              headers: headers,
              payload: body,
            });
          }
        })
        .catch((err) => {
          console.error('Error storing challenge event:', err);
        });

      // Respond immediately
      const challengeResponse = handleChallenge(body.challenge);
      return new NextResponse(challengeResponse, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    // Find webhook by path for non-challenge requests
    const { data: webhook, error: webhookError } = await supabase
      .from('webhooks')
      .select('*')
      .eq('webhook_path', path)
      .single();

    if (webhookError || !webhook) {
      console.error('Webhook not found:', path, webhookError);
      return NextResponse.json(
        { error: 'Webhook not found' },
        { status: 404 }
      );
    }

    // Get headers
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Validate signature for actual events
    const signature = headers['x-li-signature'] || headers['X-Li-Signature'];
    
    if (signature) {
      const clientSecret = decryptSecret(webhook.encrypted_secret);
      const isValid = validateLinkedInSignature(bodyText, signature, clientSecret);

      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    // Store the event
    const { error: insertError } = await supabase.from('events').insert({
      webhook_id: webhook.id,
      event_type: 'notification',
      headers: headers,
      payload: body,
    });

    if (insertError) {
      console.error('Error storing event:', insertError);
    }

    // Check if we have more than 50 events and delete oldest ones
    const { data: eventCount } = await supabase
      .from('events')
      .select('id', { count: 'exact', head: true })
      .eq('webhook_id', webhook.id);

    if (eventCount && (eventCount as any).count > 50) {
      // Get oldest events to delete
      const { data: oldestEvents } = await supabase
        .from('events')
        .select('id')
        .eq('webhook_id', webhook.id)
        .order('received_at', { ascending: true })
        .limit((eventCount as any).count - 50);

      if (oldestEvents && oldestEvents.length > 0) {
        const idsToDelete = oldestEvents.map(e => e.id);
        await supabase
          .from('events')
          .delete()
          .in('id', idsToDelete);
      }
    }

    return NextResponse.json(
      { success: true, message: 'Event received' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in LinkedIn webhook handler:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Also handle GET for challenge requests (LinkedIn sometimes sends GET)
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string } }
) {
  try {
    const { path } = params;
    const searchParams = request.nextUrl.searchParams;
    const challenge = searchParams.get('challenge');

    if (!challenge) {
      return NextResponse.json(
        { message: 'Webhook endpoint active' },
        { status: 200 }
      );
    }

    // Find webhook by path
    const { data: webhook, error: webhookError } = await supabase
      .from('webhooks')
      .select('*')
      .eq('webhook_path', path)
      .single();

    if (webhookError || !webhook) {
      return NextResponse.json(
        { error: 'Webhook not found' },
        { status: 404 }
      );
    }

    // Get headers
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Store challenge event
    await supabase.from('events').insert({
      webhook_id: webhook.id,
      event_type: 'challenge',
      headers: headers,
      payload: { challenge },
    });

    // Respond to challenge
    const challengeResponse = handleChallenge(challenge);
    return new NextResponse(challengeResponse, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error) {
    console.error('Error in LinkedIn webhook GET handler:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
