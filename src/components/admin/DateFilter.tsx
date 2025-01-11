import React from 'react';
import { Calendar } from 'lucide-react';
import { HOLIDAYS } from '../../data/holidays';

interface DateFilterProps {
  selectedDate: string;
  onChange: (date: string) => void;
}

export function DateFilter({ selectedDate, onChange }: DateFilterProps) {
  return (
    <div className="flex items-center space-x-2">
      <Calendar className="h-5 w-5 text-blue-600" />
      <select
        value={selectedDate}
        onChange={(e) => onChange(e.target.value)}
        className="form-select rounded-md border-gray-300 shadow-sm focus:border-blue-500 
                 focus:ring-blue-500 text-sm"
      >
        <option value="">Todos los días</option>
        {HOLIDAYS.map((holiday) => (
          <option key={holiday.date} value={holiday.date}>
            {new Date(holiday.date).toLocaleDateString('es-ES', { 
              day: 'numeric',
              month: 'long'
            })} - {holiday.name}
          </option>
        ))}
      </select>
    </div>
  );
}