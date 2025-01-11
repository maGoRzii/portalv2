import React from 'react';
import { Calendar, User, Printer } from 'lucide-react';
import { formatDate } from '../../utils/date';
import { PrintButton } from './PrintButton';

interface SubmissionCardProps {
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
  onPrint: () => void;
}

export function SubmissionCard({ submission, onPrint }: SubmissionCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <User className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            {submission.first_name} {submission.last_name}
          </h3>
        </div>
        <PrintButton onClick={onPrint} />
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Calendar className="h-4 w-4 text-blue-600 mr-2" />
            Días Seleccionados
          </h4>
          <div className="space-y-2">
            {submission.holiday_shifts.map((shift, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span>{formatDate(shift.holiday_date)}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  shift.compensation_type === 'double' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {shift.compensation_type === 'double' ? 'Pago doble' : 'Día libre'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {submission.comments && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Comentarios</h4>
            <p className="text-sm text-gray-600">{submission.comments}</p>
          </div>
        )}

        <div className="text-xs text-gray-500">
          Enviado el {formatDate(submission.created_at)}
        </div>
      </div>
    </div>
  );
}