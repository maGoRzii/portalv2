import React from 'react';
import { X } from 'lucide-react';

interface LeaveNotificationProps {
  employeeNames: string;
  onClose: () => void;
}

export function LeaveNotification({ employeeNames, onClose }: LeaveNotificationProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-lg font-medium text-orange-800">
              ⚠️ Aviso de baja programada
            </p>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-3">
            <p className="text-gray-600">
              Los siguientes empleados causarán baja mañana:
            </p>
            <p className="font-medium text-gray-900 bg-orange-50 p-3 rounded-lg">
              {employeeNames}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}