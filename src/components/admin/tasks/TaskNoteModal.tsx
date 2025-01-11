import React from 'react';
import { X } from 'lucide-react';

interface TaskNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: string;
  title: string;
}

export function TaskNoteModal({ isOpen, onClose, note, title }: TaskNoteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{note}</p>
        </div>
        <div className="mt-4">
          <button
            onClick={onClose}
            className="w-full inline-flex justify-center rounded-md border border-gray-300 
                     shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 
                     hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                     focus:ring-blue-500 sm:text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}