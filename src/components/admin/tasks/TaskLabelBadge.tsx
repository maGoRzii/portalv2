import React from 'react';
import { TASK_LABELS } from '../../../types/taskLabel';

interface TaskLabelBadgeProps {
  labelId: string;
}

export function TaskLabelBadge({ labelId }: TaskLabelBadgeProps) {
  const label = TASK_LABELS.find(l => l.id === labelId);
  if (!label) return null;

  return (
    <span 
      className="text-xs px-2 py-1 rounded-full inline-block font-medium"
      style={{ 
        backgroundColor: `${label.color}15`,
        color: label.color,
        borderWidth: '1px',
        borderColor: `${label.color}30`
      }}
    >
      {label.name}
    </span>
  );
}