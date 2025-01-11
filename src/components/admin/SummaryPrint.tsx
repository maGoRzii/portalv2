import React from 'react';
import { formatDate } from '../../utils/date';

interface Submission {
  id: string;
  first_name: string;
  last_name: string;
  comments: string;
  created_at: string;
  holiday_shifts: Array<{
    holiday_date: string;
    compensation_type: string;
  }>;
}

interface SummaryPrintProps {
  submissions: Submission[];
  selectedDate: string;
}

export function SummaryPrint({ submissions, selectedDate }: SummaryPrintProps) {
  const filteredSubmissions = selectedDate
    ? submissions.filter(sub => 
        sub.holiday_shifts.some(shift => shift.holiday_date === selectedDate)
      )
    : submissions;

  return (
    <div className="p-8 max-w-4xl mx-auto print:mx-0 print:max-w-none print:p-0">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Resumen de Turnos Festivos</h1>
        {selectedDate && (
          <p className="text-gray-600">
            Filtrado por: {formatDate(selectedDate)}
          </p>
        )}
      </div>

      <div className="space-y-8">
        {filteredSubmissions.map((submission) => (
          <div key={submission.id} className="border-b pb-6 mb-6 print:break-inside-avoid">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-600">Empleado:</p>
                <p className="font-medium">
                  {submission.first_name} {submission.last_name}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Fecha de solicitud:</p>
                <p className="font-medium">{formatDate(submission.created_at)}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-gray-600 mb-2">Días seleccionados:</p>
              <div className="space-y-2">
                {submission.holiday_shifts
                  .filter(shift => !selectedDate || shift.holiday_date === selectedDate)
                  .map((shift, index) => (
                    <div key={index} className="flex justify-between items-center py-1">
                      <span>{formatDate(shift.holiday_date)}</span>
                      <span className="font-medium">
                        {shift.compensation_type === 'double' ? 'Pago doble' : 'Día libre'}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {submission.comments && (
              <div className="mt-4">
                <p className="text-gray-600">Comentarios:</p>
                <p className="text-sm mt-1">{submission.comments}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 print:fixed print:bottom-0 print:left-0 print:right-0 print:p-8">
        <div className="border-t pt-4">
          <p className="text-sm text-gray-500 text-center">
            Total de registros: {filteredSubmissions.length}
          </p>
        </div>
      </div>
    </div>
  );
}