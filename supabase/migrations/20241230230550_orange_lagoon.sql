/*
  # Create Lanzadera Check-in/out System

  1. New Tables
    - `lanzadera_records`
      - `id` (uuid, primary key)
      - `driver_name` (text)
      - `type` (text) - 'check_in' or 'check_out'
      - `status` (text) - 'pending', 'approved', 'rejected'
      - `approved_by` (uuid) - References auth.users
      - `created_at` (timestamptz)
      - `approved_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for public insert and authenticated read/update
*/

CREATE TABLE IF NOT EXISTS lanzadera_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_name text NOT NULL,
  type text NOT NULL CHECK (type IN ('check_in', 'check_out')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  approved_at timestamptz
);

-- Enable RLS
ALTER TABLE lanzadera_records ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can insert records"
ON lanzadera_records FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Authenticated users can read records"
ON lanzadera_records FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update records"
ON lanzadera_records FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);