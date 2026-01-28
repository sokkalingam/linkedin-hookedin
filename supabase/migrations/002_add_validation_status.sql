-- Add validation_status column to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS validation_status VARCHAR(20) DEFAULT 'valid';

-- Add index for filtering by validation status
CREATE INDEX IF NOT EXISTS idx_events_validation_status ON events(validation_status);

-- Add comment to explain the column
COMMENT ON COLUMN events.validation_status IS 'Signature validation status: valid, invalid, or no_signature';
