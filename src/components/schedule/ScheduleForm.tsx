import React from 'react';
import { Clock } from 'lucide-react';
import { PersonalInfo } from '../PersonalInfo';
import { Comments } from '../Comments';
import { useScheduleForm } from '../../hooks/useScheduleForm';

export function ScheduleForm() {
  const { formData, isSubmitting, handleFormDataChange, handleSubmit } = useScheduleForm();

  return (
    <div className="max-w-2xl mx-auto bg-gradient-to-b from-white to-gray-50 rounded-lg border border-gray-200 p-8 mt-16">
      <h1 className="text-3xl font-light text-gray-900 mb-8 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-subtle">
          <Clock className="h-6 w-6 text-white stroke-[1.5]" />
        </div>
        <span>Solicitud de Cambio de Horario</span>
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <PersonalInfo 
          formData={formData}
          onChange={handleFormDataChange}
        />
        
        <Comments
          value={formData.comments}
          onChange={(comments) => handleFormDataChange({ comments })}
          label="Detalles del cambio"
          placeholder="Describe el cambio de horario que necesitas..."
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-6 rounded-lg font-medium text-white
                   bg-gradient-subtle hover:bg-gradient-subtle-hover
                   transition-all duration-200 focus:outline-none focus:ring-2 
                   focus:ring-gray-900 focus:ring-offset-2
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
        </button>
      </form>
    </div>
  );
}