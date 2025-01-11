import React, { useState } from 'react';
import { X, Calendar, Users, Edit2, FileText } from 'lucide-react';
import { TaskType } from '../../../types/task';
import { formatDate } from '../../../utils/date';
import { TaskEditForm } from './TaskEditForm';
import { TaskLabelBadge } from './TaskLabelBadge';
import { TaskNoteModal } from './TaskNoteModal';

interface TaskCardProps {
  task: TaskType;
  columnId: string;
  onDelete: () => void;
  onEdit: (taskId: string, title: string, dueDate: string | null, assignees: string[], labelId: string | null, notes: string | null) => Promise<void>;
}

export function TaskCard({ task, columnId, onDelete, onEdit }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.setData('columnId', columnId);
  };

  const handleEdit = async (title: string, dueDate: string | null, assignees: string[], labelId: string | null, notes: string | null) => {
    await onEdit(task.id, title, dueDate, assignees, labelId, notes);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <TaskEditForm
        task={task}
        onSubmit={handleEdit}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  const cardStyle = task.label_color ? {
    backgroundColor: `${task.label_color}08`,
    borderColor: task.label_color,
    borderWidth: '1px',
  } : undefined;

  return (
    <>
      <div
        draggable
        onDragStart={handleDragStart}
        className="p-3 rounded-lg shadow-sm cursor-move hover:shadow-md transition-all duration-200"
        style={cardStyle}
      >
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-2">
            <p className="text-gray-900 font-medium">{task.title}</p>
            {task.label_id && (
              <TaskLabelBadge labelId={task.label_id} />
            )}
          </div>
          <div className="flex gap-2">
            {task.notes && (
              <button
                onClick={() => setIsNoteModalOpen(true)}
                className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
              >
                <FileText className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={onDelete}
              className="text-gray-400 hover:text-red-500 transition-colors duration-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {task.due_date && (
          <div className="flex items-center gap-1 mt-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-xs text-gray-500">
              {formatDate(task.due_date)}
            </span>
          </div>
        )}

        {task.assignee_names && task.assignee_names.length > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <Users className="h-4 w-4 text-gray-500" />
            <div className="flex flex-wrap gap-1">
              {task.assignee_names.map((name, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <TaskNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        note={task.notes || ''}
        title={task.title}
      />
    </>
  );
}