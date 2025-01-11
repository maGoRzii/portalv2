-- Drop the existing view first to remove dependencies
DROP VIEW IF EXISTS tasks_with_assignee;

-- Create a new junction table for task assignments
CREATE TABLE task_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  user_id uuid REFERENCES assignable_users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(task_id, user_id)
);

-- Enable RLS
ALTER TABLE task_assignments ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Public access for task assignments"
ON task_assignments FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Now we can safely remove the old column
ALTER TABLE tasks DROP COLUMN IF EXISTS assigned_to;

-- Create new view with multiple assignees
CREATE VIEW tasks_with_assignee AS
SELECT 
  t.*,
  array_agg(au.email) FILTER (WHERE au.email IS NOT NULL) as assignee_emails,
  array_agg(au.name) FILTER (WHERE au.name IS NOT NULL) as assignee_names
FROM tasks t
LEFT JOIN task_assignments ta ON t.id = ta.task_id
LEFT JOIN assignable_users au ON ta.user_id = au.id
GROUP BY t.id, t.title, t.status, t.created_at, t.updated_at, t.due_date;