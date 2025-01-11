import React from 'react';
import { REQUEST_TYPES } from '../../types/request';

interface RequestTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function RequestTypeSelect({ value, onChange, className = '' }: RequestTypeSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-3 border border-gray-200 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-purple-500 
                 transition-colors duration-200 bg-white/50 ${className}`}
      required
    >
      <option value="">Seleccionar tipo de petición</option>
      {REQUEST_TYPES.map((type) => (
        <option key={type.id} value={type.id}>
          {type.label}
        </option>
      ))}
    </select>
  );
}