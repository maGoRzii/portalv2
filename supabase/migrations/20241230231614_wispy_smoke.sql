/*
  # Feature Flags Table
  
  1. New Tables
    - `feature_flags`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `enabled` (boolean)
      - `updated_at` (timestamp)
      - `updated_by` (uuid, references auth.users)
  
  2. Security
    - Enable RLS
    - Add policies for read/write access
*/

CREATE TABLE IF NOT EXISTS feature_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access for feature flags"
ON feature_flags FOR SELECT
TO public
USING (true);

CREATE POLICY "Only authenticated users can update feature flags"
ON feature_flags FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert initial feature flag for uniforms
INSERT INTO feature_flags (name, enabled)
VALUES ('uniforms_enabled', true)
ON CONFLICT (name) DO NOTHING;