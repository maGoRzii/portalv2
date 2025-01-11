import React from 'react';
import { formatDate } from '../../../utils/date';
import { PrintButton } from '../PrintButton';

interface Submission {
  first_name: string;
  last_name: string;
  comments: string;
  holiday_shifts: Array<{
    holiday_date: string;
    compensation_type: string;
  }>;
}

interface HolidayDatePrintViewProps {
  date: string;
  submissions: Submission[];
  onPrint: () => void;
}

export function HolidayDatePrintView({ date, submissions, onPrint }: HolidayDatePrintViewProps) {
  const filteredSubmissions = submissions.filter(submission =>
    submission.holiday_shifts.some(shift => shift.holiday_date === date)
  );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="fixed top-4 right-4 no-print">
        <PrintButton onClick={onPrint} />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Lista de Personal - Día Festivo</h1>
        <p className="text-gray-600">{formatDate(date)}</p>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Apellidos
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Compensación
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Comentarios
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredSubmissions.map((submission, index) => {
            const shift = submission.holiday_shifts.find(s => s.date === date);
            return (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {submission.first_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {submission.last_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${shift?.compensation_type === 'double' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'}`}
                  >
                    {shift?.compensation_type === 'double' ? 'Pago doble' : 'Día libre'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {submission.comments || '-'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="mt-8 text-right text-sm text-gray-500">
        Total registros: {filteredSubmissions.length}
      </div>
    </div>
  );
}