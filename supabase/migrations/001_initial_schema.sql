-- Create webhooks table
CREATE TABLE IF NOT EXISTS webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id VARCHAR(255) NOT NULL,
    encrypted_secret TEXT NOT NULL,
    webhook_path VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_webhook_path UNIQUE (webhook_path)
);

-- Create index on client_id for faster lookups
CREATE INDEX idx_webhooks_client_id ON webhooks(client_id);

-- Create index on last_accessed_at for cleanup queries
CREATE INDEX idx_webhooks_last_accessed ON webhooks(last_accessed_at);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webhook_id UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'challenge' or 'notification'
    headers JSONB NOT NULL,
    payload JSONB NOT NULL,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on webhook_id for faster event lookups
CREATE INDEX idx_events_webhook_id ON events(webhook_id);

-- Create index on received_at for ordering
CREATE INDEX idx_events_received_at ON events(received_at DESC);

-- Create composite index for webhook events query
CREATE INDEX idx_events_webhook_received ON events(webhook_id, received_at DESC);

-- Add constraint to ensure max 3 webhooks per client_id
-- This will be enforced in application logic due to complexity

-- Enable Row Level Security (optional, but recommended)
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since no auth is required)
CREATE POLICY "Allow all operations on webhooks" ON webhooks
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on events" ON events
    FOR ALL USING (true) WITH CHECK (true);
