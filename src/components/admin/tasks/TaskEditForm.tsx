import React, { useState } from 'react';
import { ADMIN_USERS } from '../../../data/users';
import { TaskType } from '../../../types/task';
import { TaskLabelSelect } from './TaskLabelSelect';

interface TaskEditFormProps {
  task: TaskType;
  onSubmit: (title: string, dueDate: string | null, assignees: string[], labelId: string | null, notes: string | null) => Promise<void>;
  onCancel: () => void;
}

export function TaskEditForm({ task, onSubmit, onCancel }: TaskEditFormProps) {
  const [title, setTitle] = useState(task.title);
  const [dueDate, setDueDate] = useState(task.due_date || '');
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>(
    task.assignee_emails || []
  );
  const [selectedLabel, setSelectedLabel] = useState(task.label_id || '');
  const [notes, setNotes] = useState(task.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(
        title.trim(),
        dueDate || null,
        selectedAssignees,
        selectedLabel || null,
        notes.trim() || null
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAssignee = (email: string) => {
    setSelectedAssignees(prev =>
      prev.includes(email)
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título de la tarea"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none 
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        autoFocus
      />

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notas adicionales..."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none 
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
      />

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none 
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Etiqueta:</label>
        <TaskLabelSelect
          value={selectedLabel}
          onChange={setSelectedLabel}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Asignar a:</label>
        <div className="space-y-2">
          {ADMIN_USERS.map(user => (
            <label key={user.email} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedAssignees.includes(user.email)}
                onChange={() => toggleAssignee(user.email)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{user.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700
                   transition-colors duration-200 disabled:opacity-50"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300
                   transition-colors duration-200"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}