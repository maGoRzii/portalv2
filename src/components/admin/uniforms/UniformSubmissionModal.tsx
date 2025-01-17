import React from 'react';
import { X } from 'lucide-react';
import { formatDate } from '../../../utils/date';
import { DeleteButton } from '../DeleteButton';
import { UNIFORM_DATA } from '../../../data/uniforms';

interface UniformSubmissionModalProps {
  submission: any;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export function UniformSubmissionModal({ submission, onClose, onDelete }: UniformSubmissionModalProps) {
  const getItemName = (itemId: string) => {
    for (const category of UNIFORM_DATA) {
      const item = category.items.find(item => item.id === itemId);
      if (item) return item.name;
    }
    return itemId;
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta solicitud?')) {
      await onDelete(submission.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {submission.first_name} {submission.last_name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(submission.created_at)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <DeleteButton onDelete={handleDelete} />
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Items */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Prendas solicitadas:</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2">
                {submission.uniform_items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">{getItemName(item.item_id)}</span>
                    <span className="font-medium text-gray-900">{item.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}