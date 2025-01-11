/*
  # Create uniform request tables

  1. New Tables
    - `uniform_requests`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `created_at` (timestamp)
    - `uniform_items`
      - `id` (uuid, primary key)
      - `request_id` (uuid, foreign key)
      - `item_id` (text)
      - `size` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public insert and authenticated read access
*/

-- Create uniform requests table
CREATE TABLE IF NOT EXISTS uniform_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create uniform items table
CREATE TABLE IF NOT EXISTS uniform_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES uniform_requests(id) ON DELETE CASCADE,
  item_id text NOT NULL,
  size text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE uniform_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE uniform_items ENABLE ROW LEVEL SECURITY;

-- Create policies for uniform_requests
CREATE POLICY "Anyone can insert uniform requests"
ON uniform_requests FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Only authenticated users can read uniform requests"
ON uniform_requests FOR SELECT
TO authenticated
USING (true);

-- Create policies for uniform_items
CREATE POLICY "Anyone can insert uniform items"
ON uniform_items FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Only authenticated users can read uniform items"
ON uniform_items FOR SELECT
TO authenticated
USING (true);