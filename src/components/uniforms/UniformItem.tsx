import React from 'react';
import { UniformItem as UniformItemType } from '../../types/uniform';
import { UNIFORM_SIZES } from '../../data/uniforms';

interface UniformItemProps {
  item: UniformItemType;
  selectedSize: string;
  onSelect: (size: string) => void;
}

export function UniformItem({ item, selectedSize, onSelect }: UniformItemProps) {
  const sizes = UNIFORM_SIZES[item.id as keyof typeof UNIFORM_SIZES] || [];

  return (
    <div className="p-4 bg-white/40 rounded-lg border border-gray-100 hover:bg-white/60 transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <label className="font-medium text-gray-700 min-w-[120px]">
          {item.name}
        </label>
        <div className="flex-1">
          <select
            value={selectedSize}
            onChange={(e) => onSelect(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-purple-500 
                     transition-all duration-200 bg-white/50"
          >
            <option value="">Seleccionar talla</option>
            {sizes.map((size) => (
              <option key={size.id} value={size.id}>
                {size.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}