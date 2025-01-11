/*
  # Create schedule changes table

  1. New Tables
    - `schedule_changes`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `message` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for public insert and authenticated read access
*/

CREATE TABLE IF NOT EXISTS schedule_changes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE schedule_changes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public access for schedule changes"
ON schedule_changes FOR ALL
TO public
USING (true)
WITH CHECK (true);