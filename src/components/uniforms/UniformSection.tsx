import React from 'react';
import { UniformCategory } from '../../types/uniform';
import { UniformItem } from './UniformItem';

interface UniformSectionProps {
  category: UniformCategory;
  selectedItems: Record<string, string>;
  onItemSelect: (itemId: string, size: string) => void;
}

export function UniformSection({ category, selectedItems, onItemSelect }: UniformSectionProps) {
  return (
    <div className="animate-slide-in" style={{ opacity: 0, animationDelay: '100ms' }}>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {category.name}
      </h2>
      <div className="space-y-4">
        {category.items.map((item) => (
          <UniformItem
            key={item.id}
            item={item}
            selectedSize={selectedItems[item.id]}
            onSelect={(size) => onItemSelect(item.id, size)}
          />
        ))}
      </div>
    </div>
  );
}