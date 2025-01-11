/*
  # Add task labels support

  1. Changes
    - Drop existing view first to remove dependencies
    - Drop old group-related columns and table
    - Add new label columns for tasks
    - Recreate view with label fields
*/

-- Drop the view first to remove dependencies
DROP VIEW IF EXISTS tasks_with_assignee;

-- Drop old group-related columns and table
ALTER TABLE tasks 
DROP COLUMN IF EXISTS group_id;

DROP TABLE IF EXISTS task_groups;

-- Add new label columns
ALTER TABLE tasks
ADD COLUMN label_id text,
ADD COLUMN label_name text,
ADD COLUMN label_color text;

-- Recreate view with label fields
CREATE VIEW tasks_with_assignee AS
SELECT 
  t.*,
  array_agg(au.email) FILTER (WHERE au.email IS NOT NULL) as assignee_emails,
  array_agg(au.name) FILTER (WHERE au.name IS NOT NULL) as assignee_names
FROM tasks t
LEFT JOIN task_assignments ta ON t.id = ta.task_id
LEFT JOIN assignable_users au ON ta.user_id = au.id
GROUP BY t.id, t.title, t.status, t.created_at, t.updated_at, t.due_date, 
         t.label_id, t.label_name, t.label_color;