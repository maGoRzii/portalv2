-- Create requests table with file attachments support
CREATE TABLE IF NOT EXISTS requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  message text NOT NULL,
  attachments jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public access for requests"
ON requests FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Add feature flag
INSERT INTO feature_flags (name, enabled)
VALUES ('requests_enabled', true)
ON CONFLICT (name) DO NOTHING;