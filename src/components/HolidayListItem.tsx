import React from 'react';
import { Holiday, ShiftPreference } from '../types';

interface HolidayListItemProps {
  holiday: Holiday;
  shift: ShiftPreference;
  onShiftChange: (date: string, field: 'selected' | 'compensation', value: any) => void;
  index: number;
}

export function HolidayListItem({ holiday, shift, onShiftChange, index }: HolidayListItemProps) {
  return (
    <div 
      className="group p-4 bg-white/40 rounded-lg border border-gray-100 
                hover:bg-white/60 transition-all duration-200 transform hover:scale-[1.02]"
      style={{ 
        opacity: 0, 
        animation: 'fadeIn 0.5s ease-out forwards',
        animationDelay: `${index * 100}ms`
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          <input
            type="checkbox"
            checked={shift.selected}
            onChange={(e) => onShiftChange(holiday.date, 'selected', e.target.checked)}
            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 transition-colors duration-200"
          />
          <span className="font-medium text-gray-700">
            {new Date(holiday.date).toLocaleDateString('es-ES', { 
              day: 'numeric',
              month: 'long'
            })} - {holiday.name}
          </span>
        </div>
        
        {shift.selected && (
          <div className="ml-8 sm:ml-0">
            <select
              value={shift.compensation}
              onChange={(e) => onShiftChange(holiday.date, 'compensation', e.target.value)}
              required
              className="w-full sm:w-auto px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                       focus:ring-2 focus:ring-purple-500 transition-all duration-200 bg-white/50"
            >
              <option value="">Tipo de compensación</option>
              <option value="double">Pago doble</option>
              <option value="day-off">Día libre</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}