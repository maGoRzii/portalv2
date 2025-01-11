import React from 'react';
import { formatDate } from '../../utils/date';

interface Submission {
  id: string;
  first_name: string;
  last_name: string;
  comments: string;
  created_at: string;
  holiday_shifts: {
    holiday_date: string;
    compensation_type: string;
  }[];
}

interface Props {
  submissions: Submission[];
}

export function SubmissionsTable({ submissions }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Empleado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Días Seleccionados
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Comentarios
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha de Solicitud
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {submissions.map((submission) => (
            <tr key={submission.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {submission.first_name} {submission.last_name}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  {submission.holiday_shifts.map((shift, index) => (
                    <div key={index} className="mb-1">
                      {formatDate(shift.holiday_date)} - {' '}
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {shift.compensation_type === 'double' ? 'Pago doble' : 'Día libre'}
                      </span>
                    </div>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  {submission.comments || '-'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {formatDate(submission.created_at)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}