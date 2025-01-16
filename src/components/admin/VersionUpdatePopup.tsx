import React from 'react';
import { X, Palmtree, FileText, Calendar } from 'lucide-react';

interface VersionUpdatePopupProps {
  onClose: () => void;
}

export function VersionUpdatePopup({ onClose }: VersionUpdatePopupProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium text-gray-900">
              Novedades de la versión 1.5.9
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Palmtree className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-600">
                Apartado "Vacaciones", para ver las vacaciones pendientes de todos los empleados.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-600">
                Informe de vacaciones detallado, pudiendo elegir el año que queramos.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-600">
                Informe con listado de empleados completo y suma de horas totales de los contratos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}