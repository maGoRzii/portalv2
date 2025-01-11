import React from 'react';
import { Calendar } from 'lucide-react';

interface TaskDateFilterProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  onClearDate: () => void;
}

export function TaskDateFilter({ selectedDate, onDateChange, onClearDate }: TaskDateFilterProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-blue-600" />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      {selectedDate && (
        <button
          onClick={onClearDate}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Mostrar todas
        </button>
      )}
    </div>
  );
}