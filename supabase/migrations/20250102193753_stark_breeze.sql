-- Drop existing view if it exists
DROP VIEW IF EXISTS tasks_with_assignee;

-- Create view for tasks with assignee information
CREATE VIEW tasks_with_assignee AS
SELECT 
  t.*,
  au.email as assignee_email
FROM tasks t
LEFT JOIN admin_users au ON t.assigned_to = au.id;