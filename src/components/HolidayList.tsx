import React from 'react';
import { Calendar } from 'lucide-react';
import { ShiftPreference } from '../types';
import { HOLIDAYS } from '../data/holidays';
import { HolidayListItem } from './HolidayListItem';

interface HolidayListProps {
  shifts: ShiftPreference[];
  onShiftChange: (date: string, field: 'selected' | 'compensation', value: any) => void;
}

export function HolidayList({ shifts, onShiftChange }: HolidayListProps) {
  return (
    <div className="animate-slide-in" style={{ opacity: 0, animationDelay: '100ms' }}>
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Calendar className="text-purple-600" />
        Días Festivos
      </h2>
      <div className="space-y-3">
        {HOLIDAYS.map((holiday, index) => (
          <HolidayListItem
            key={holiday.date}
            holiday={holiday}
            shift={shifts.find(s => s.date === holiday.date)!}
            onShiftChange={onShiftChange}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}