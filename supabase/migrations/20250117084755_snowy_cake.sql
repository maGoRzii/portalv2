/*
  # Add uniform sizes table

  1. New Tables
    - `uniform_sizes`
      - `id` (uuid, primary key)
      - `category_id` (text)
      - `item_id` (text)
      - `size_id` (text)
      - `size_label` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `uniform_sizes` table
    - Add policy for authenticated users to manage sizes
*/

-- Create uniform sizes table
CREATE TABLE IF NOT EXISTS uniform_sizes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id text NOT NULL,
  item_id text NOT NULL,
  size_id text NOT NULL,
  size_label text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(item_id, size_id)
);

-- Enable RLS
ALTER TABLE uniform_sizes ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Authenticated users can manage uniform sizes"
ON uniform_sizes FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create updated_at trigger
CREATE TRIGGER update_uniform_sizes_updated_at
  BEFORE UPDATE ON uniform_sizes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_uniform_sizes_item ON uniform_sizes(item_id);
CREATE INDEX idx_uniform_sizes_category ON uniform_sizes(category_id);