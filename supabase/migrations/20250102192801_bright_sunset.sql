/*
  # Add Task Management Tables

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text)
      - `status` (text) - can be 'todo', 'inProgress', or 'done'
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `tasks` table
    - Add policies for public access (temporary, should be restricted to authenticated users in production)
*/

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  status text NOT NULL CHECK (status IN ('todo', 'inProgress', 'done')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public access for tasks"
ON tasks FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();