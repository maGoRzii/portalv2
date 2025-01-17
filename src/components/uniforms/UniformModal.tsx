import React from 'react';
import { X } from 'lucide-react';
import { UniformCategory } from '../../types/uniform';
import { UniformItem } from './UniformItem';

interface UniformModalProps {
  category: UniformCategory;
  selectedSizes: Record<string, string>;
  onItemSelect: (itemId: string, size: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function UniformModal({ 
  category, 
  selectedSizes, 
  onItemSelect, 
  onClose,
  onSubmit,
  isSubmitting
}: UniformModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-gray-900">
              {category.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {category.items.map((item) => (
              <UniformItem
                key={item.id}
                item={item}
                selectedSize={selectedSizes[item.id] || ''}
                onSelect={(size) => onItemSelect(item.id, size)}
              />
            ))}
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border 
                       border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border 
                       border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}