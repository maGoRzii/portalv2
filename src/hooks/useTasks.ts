import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TaskType } from '../types/task';
import { TASK_LABELS } from '../types/taskLabel';
import { toast } from 'react-hot-toast';

export function useTasks() {
  const [tasks, setTasks] = useState<Record<string, TaskType[]>>({
    todo: [],
    inProgress: [],
    done: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks_with_assignee')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const groupedTasks = (data || []).reduce((acc, task) => ({
        ...acc,
        [task.status]: [...(acc[task.status] || []), task]
      }), {
        todo: [],
        inProgress: [],
        done: []
      });

      setTasks(groupedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (
    status: string, 
    title: string, 
    dueDate: string | null = null, 
    assignees: string[] = [],
    labelId: string | null = null,
    notes: string | null = null
  ) => {
    try {
      const label = labelId ? TASK_LABELS.find(l => l.id === labelId) : null;

      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .insert({ 
          title, 
          status,
          due_date: dueDate,
          label_id: labelId,
          label_name: label?.name,
          label_color: label?.color,
          notes
        })
        .select()
        .single();

      if (taskError) throw taskError;

      if (assignees.length > 0) {
        const { data: usersData, error: usersError } = await supabase
          .from('assignable_users')
          .select('id')
          .in('email', assignees);

        if (usersError) throw usersError;

        if (usersData && usersData.length > 0) {
          const assignments = usersData.map(user => ({
            task_id: taskData.id,
            user_id: user.id
          }));

          const { error: assignError } = await supabase
            .from('task_assignments')
            .insert(assignments);

          if (assignError) throw assignError;
        }
      }

      await loadTasks();
      toast.success('Tarea añadida');
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Error al añadir la tarea');
    }
  };

  const editTask = async (
    taskId: string, 
    title: string, 
    dueDate: string | null, 
    assignees: string[],
    labelId: string | null,
    notes: string | null
  ) => {
    try {
      const label = labelId ? TASK_LABELS.find(l => l.id === labelId) : null;

      const { error: taskError } = await supabase
        .from('tasks')
        .update({ 
          title,
          due_date: dueDate,
          label_id: labelId,
          label_name: label?.name,
          label_color: label?.color,
          notes
        })
        .eq('id', taskId);

      if (taskError) throw taskError;

      const { error: deleteError } = await supabase
        .from('task_assignments')
        .delete()
        .eq('task_id', taskId);

      if (deleteError) throw deleteError;

      if (assignees.length > 0) {
        const { data: usersData, error: usersError } = await supabase
          .from('assignable_users')
          .select('id')
          .in('email', assignees);

        if (usersError) throw usersError;

        if (usersData && usersData.length > 0) {
          const assignments = usersData.map(user => ({
            task_id: taskId,
            user_id: user.id
          }));

          const { error: assignError } = await supabase
            .from('task_assignments')
            .insert(assignments);

          if (assignError) throw assignError;
        }
      }

      await loadTasks();
      toast.success('Tarea actualizada');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Error al actualizar la tarea');
    }
  };

  const moveTask = async (taskId: string, fromColumn: string, toColumn: string) => {
    try {
      const task = tasks[fromColumn].find(t => t.id === taskId);
      if (!task) return;

      const { error } = await supabase
        .from('tasks')
        .update({ status: toColumn })
        .eq('id', taskId);

      if (error) throw error;

      await loadTasks();
      toast.success('Tarea movida');
    } catch (error) {
      console.error('Error moving task:', error);
      toast.error('Error al mover la tarea');
    }
  };

  const deleteTask = async (columnId: string, taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => ({
        ...prev,
        [columnId]: prev[columnId].filter(task => task.id !== taskId)
      }));

      toast.success('Tarea eliminada');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Error al eliminar la tarea');
    }
  };

  return {
    tasks,
    loading,
    addTask,
    editTask,
    moveTask,
    deleteTask
  };
}