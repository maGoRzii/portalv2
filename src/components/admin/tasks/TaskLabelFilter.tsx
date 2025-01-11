import React from 'react';
import { Tag } from 'lucide-react';
import { TASK_LABELS } from '../../../types/taskLabel';

interface TaskLabelFilterProps {
  selectedLabel: string;
  onChange: (labelId: string) => void;
}

export function TaskLabelFilter({ selectedLabel, onChange }: TaskLabelFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <Tag className="h-5 w-5 text-blue-600" />
      <select
        value={selectedLabel}
        onChange={(e) => onChange(e.target.value)}
        className="form-select rounded-lg border-gray-300 text-sm
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Todas las etiquetas</option>
        {TASK_LABELS.map((label) => (
          <option key={label.id} value={label.id}>
            {label.name}
          </option>
        ))}
      </select>
    </div>
  );
}