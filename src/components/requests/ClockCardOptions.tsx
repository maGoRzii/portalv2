import React from 'react';
import { CLOCK_CARD_OPTIONS, ClockCardOption } from '../../types/request';

interface ClockCardOptionsProps {
  value: ClockCardOption | undefined;
  onChange: (value: ClockCardOption) => void;
}

export function ClockCardOptions({ value, onChange }: ClockCardOptionsProps) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Selecciona una opción:
      </label>
      <div className="space-y-2">
        {CLOCK_CARD_OPTIONS.map((option) => (
          <label key={option.value} className="flex items-center gap-2">
            <input
              type="radio"
              name="clockCardOption"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}