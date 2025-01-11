/*
  # Add Task Details

  1. Changes
    - Add `due_date` column to tasks table
    - Add `assigned_to` column referencing auth.users
    - Add indexes for better query performance

  2. Security
    - Maintain existing RLS policies
*/

ALTER TABLE tasks
ADD COLUMN due_date date,
ADD COLUMN assigned_to uuid REFERENCES auth.users(id);

-- Add indexes for better performance
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);