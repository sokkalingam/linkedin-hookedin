import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { encryptSecret } from '@/lib/encryption';
import { generateWebhookPath, isValidCustomPath } from '@/lib/path-generator';
import { CreateWebhookRequest, CreateWebhookResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: CreateWebhookRequest = await request.json();
    const { clientId, clientSecret, customPath } = body;

    if (!clientId || !clientSecret) {
      return NextResponse.json<CreateWebhookResponse>(
        { success: false, error: 'Client ID and Client Secret are required' },
        { status: 400 }
      );
    }

    // Check if client already has 3 webhooks
    const { data: existingWebhooks, error: countError } = await supabase
      .from('webhooks')
      .select('id')
      .eq('client_id', clientId);

    if (countError) {
      console.error('Error checking webhook count:', countError);
      return NextResponse.json<CreateWebhookResponse>(
        { success: false, error: 'Failed to check existing webhooks' },
        { status: 500 }
      );
    }

    if (existingWebhooks && existingWebhooks.length >= 3) {
      return NextResponse.json<CreateWebhookResponse>(
        { success: false, error: 'Maximum 3 webhooks allowed per client ID' },
        { status: 400 }
      );
    }

    // Generate or validate custom path
    let webhookPath: string;
    if (customPath) {
      if (!isValidCustomPath(customPath)) {
        return NextResponse.json<CreateWebhookResponse>(
          { success: false, error: 'Invalid custom path. Use lowercase alphanumeric and hyphens only (3-50 characters)' },
          { status: 400 }
        );
      }
      webhookPath = customPath;
    } else {
      webhookPath = generateWebhookPath();
    }

    // Check if path already exists
    const { data: existingPath } = await supabase
      .from('webhooks')
      .select('id')
      .eq('webhook_path', webhookPath)
      .single();

    if (existingPath) {
      return NextResponse.json<CreateWebhookResponse>(
        { success: false, error: 'Webhook path already taken. Please try a different one.' },
        { status: 400 }
      );
    }

    // Encrypt the client secret
    const encryptedSecret = encryptSecret(clientSecret);

    // Create webhook
    const { data: webhook, error: insertError } = await supabase
      .from('webhooks')
      .insert({
        client_id: clientId,
        encrypted_secret: encryptedSecret,
        webhook_path: webhookPath,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating webhook:', insertError);
      
      // Check if it's a unique constraint violation
      if (insertError.code === '23505') {
        return NextResponse.json<CreateWebhookResponse>(
          { success: false, error: 'Webhook path already taken. Please try again.' },
          { status: 400 }
        );
      }
      
      return NextResponse.json<CreateWebhookResponse>(
        { success: false, error: 'Failed to create webhook' },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const webhookUrl = `${baseUrl}/api/linkedin-webhook/${webhookPath}`;

    return NextResponse.json<CreateWebhookResponse>(
      {
        success: true,
        webhookUrl,
        webhookPath,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in create webhook API:', error);
    return NextResponse.json<CreateWebhookResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
