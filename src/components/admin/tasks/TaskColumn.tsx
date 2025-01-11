import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { TaskType } from '../../../types/task';

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: TaskType[];
  onAddTask: (columnId: string, title: string, dueDate: string | null, assignees: string[], labelId: string | null, notes: string | null) => void;
  onEditTask: (taskId: string, title: string, dueDate: string | null, assignees: string[], labelId: string | null, notes: string | null) => Promise<void>;
  onMoveTask: (taskId: string, fromColumn: string, toColumn: string) => void;
  onDeleteTask: (columnId: string, taskId: string) => void;
}

export function TaskColumn({ 
  id, 
  title, 
  tasks, 
  onAddTask, 
  onEditTask,
  onMoveTask, 
  onDeleteTask 
}: TaskColumnProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (data: { 
    title: string; 
    dueDate: string | null; 
    assignees: string[];
    labelId: string | null;
    notes: string | null;
  }) => {
    onAddTask(id, data.title, data.dueDate, data.assignees, data.labelId, data.notes);
    setIsAdding(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const fromColumn = e.dataTransfer.getData('columnId');
    if (fromColumn !== id) {
      onMoveTask(taskId, fromColumn, id);
    }
  };

  return (
    <div
      className="bg-gray-50 rounded-lg p-4 min-h-[500px]"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>

      <div className="space-y-3">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            columnId={id}
            onDelete={() => onDeleteTask(id, task.id)}
            onEdit={onEditTask}
          />
        ))}
      </div>

      {isAdding ? (
        <div className="mt-3">
          <TaskForm
            onSubmit={handleSubmit}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="mt-3 w-full px-3 py-2 flex items-center justify-center gap-2 text-gray-700
                   bg-white border border-gray-300 rounded-lg hover:bg-gray-50
                   transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          Añadir tarea
        </button>
      )}
    </div>
  );
}