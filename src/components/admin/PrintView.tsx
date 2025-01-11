import React from 'react';
import { formatDate } from '../../utils/date';

interface PrintViewProps {
  submission: {
    first_name: string;
    last_name: string;
    comments: string;
    created_at: string;
    holiday_shifts: Array<{
      holiday_date: string;
      compensation_type: string;
    }>;
  };
}

export function PrintView({ submission }: PrintViewProps) {
  return (
    <div className="p-8 max-w-2xl mx-auto print:mx-0 print:max-w-none print:p-0">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Registro de Turnos Festivos</h1>
        <p className="text-gray-600">Fecha de solicitud: {formatDate(submission.created_at)}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Datos del Empleado</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Nombre:</p>
            <p className="font-medium">{submission.first_name}</p>
          </div>
          <div>
            <p className="text-gray-600">Apellidos:</p>
            <p className="font-medium">{submission.last_name}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Días Seleccionados</h2>
        <div className="space-y-2">
          {submission.holiday_shifts.map((shift, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b">
              <span>{formatDate(shift.holiday_date)}</span>
              <span className="font-medium">
                {shift.compensation_type === 'double' ? 'Pago doble' : 'Día libre'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {submission.comments && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Comentarios</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{submission.comments}</p>
        </div>
      )}

      <div className="mt-16 print:fixed print:bottom-0 print:left-0 print:right-0 print:p-8">
        <div className="border-t pt-4">
          <p className="text-sm text-gray-500 text-center">
            Este documento es un registro oficial de la solicitud de turnos festivos.
          </p>
        </div>
      </div>
    </div>
  );
}