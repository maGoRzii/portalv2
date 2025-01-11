/*
  # Add Admin Views Tracking

  1. New Tables
    - admin_views: Track when admins view different sections
    - notifications: Track new items that need admin attention

  2. Changes
    - Add last_viewed column to track when items were last seen
*/

-- Create admin_views table
CREATE TABLE admin_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  section text NOT NULL,
  last_viewed_at timestamptz DEFAULT now(),
  UNIQUE(admin_id, section)
);

-- Create notifications table
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  reference_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  viewed_by jsonb DEFAULT '[]'
);

-- Enable RLS
ALTER TABLE admin_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own views"
ON admin_views
FOR ALL TO authenticated
USING (auth.uid() = admin_id)
WITH CHECK (auth.uid() = admin_id);

CREATE POLICY "Users can read all notifications"
ON notifications FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can update notifications they've viewed"
ON notifications FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);