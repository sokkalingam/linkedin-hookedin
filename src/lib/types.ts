export interface Webhook {
  id: string;
  client_id: string;
  encrypted_secret: string;
  webhook_path: string;
  created_at: string;
  last_accessed_at: string;
}

export interface WebhookEvent {
  id: string;
  webhook_id: string;
  event_type: 'challenge' | 'notification';
  headers: Record<string, string>;
  payload: any;
  received_at: string;
  validation_status?: 'valid' | 'invalid' | 'no_signature';
}

export interface CreateWebhookRequest {
  clientId: string;
  clientSecret: string;
  customPath?: string;
}

export interface CreateWebhookResponse {
  success: boolean;
  webhookUrl?: string;
  webhookPath?: string;
  error?: string;
}

export interface RetrieveWebhooksResponse {
  success: boolean;
  webhooks?: Array<{
    id: string;
    webhookUrl: string;
    webhookPath: string;
    createdAt: string;
  }>;
  error?: string;
}
