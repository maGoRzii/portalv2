import React from 'react';
import { FileText } from 'lucide-react';
import { REQUEST_TYPES } from '../../../types/request';

interface RequestTypeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function RequestTypeFilter({ value, onChange }: RequestTypeFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <FileText className="h-5 w-5 text-blue-600" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-select rounded-lg border-gray-300 text-sm
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Todos los tipos</option>
        {REQUEST_TYPES.map((type) => (
          <option key={type.id} value={type.id}>
            {type.label}
          </option>
        ))}
      </select>
    </div>
  );
}