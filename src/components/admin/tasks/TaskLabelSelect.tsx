import React from 'react';
import { TASK_LABELS } from '../../../types/taskLabel';

interface TaskLabelSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TaskLabelSelect({ value, onChange, className = '' }: TaskLabelSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg 
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    >
      <option value="">Sin etiqueta</option>
      {TASK_LABELS.map((label) => (
        <option key={label.id} value={label.id}>
          {label.name}
        </option>
      ))}
    </select>
  );
}