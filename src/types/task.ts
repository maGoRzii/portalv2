export interface TaskType {
  id: string;
  title: string;
  status: 'todo' | 'inProgress' | 'done';
  due_date: string | null;
  assignee_emails?: string[];
  assignee_names?: string[];
  label_id?: string;
  label_name?: string;
  label_color?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AssignableUser {
  id: string;
  name: string;
  email: string;
}