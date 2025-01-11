import React from 'react';
import { GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function TrainingSection() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/training')}
      className="w-full p-6 rounded-lg border border-gray-200 bg-gradient-to-b 
                 from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 
                 transition-all duration-200 text-left"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-gradient-subtle hover:bg-gradient-subtle-hover text-white">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Formación</h3>
          <p className="text-sm text-gray-600 mt-1">
            Accede a todos los recursos formativos por departamento
          </p>
        </div>
      </div>
    </button>
  );
}