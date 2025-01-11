/*
  # Add notes to tasks

  1. Changes
    - Add notes column to tasks table
    - Update tasks_with_assignee view to include notes
*/

-- Add notes column to tasks table
ALTER TABLE tasks
ADD COLUMN notes text;

-- Recreate view to include notes
DROP VIEW IF EXISTS tasks_with_assignee;
CREATE VIEW tasks_with_assignee AS
SELECT 
  t.*,
  array_agg(au.email) FILTER (WHERE au.email IS NOT NULL) as assignee_emails,
  array_agg(au.name) FILTER (WHERE au.name IS NOT NULL) as assignee_names
FROM tasks t
LEFT JOIN task_assignments ta ON t.id = ta.task_id
LEFT JOIN assignable_users au ON ta.user_id = au.id
GROUP BY t.id, t.title, t.status, t.created_at, t.updated_at, t.due_date, 
         t.label_id, t.label_name, t.label_color, t.notes;