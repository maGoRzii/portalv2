import React, { useState } from 'react';
import { formatDate } from '../../../utils/date';
import { HolidaySubmissionModal } from './HolidaySubmissionModal';
import { supabase } from '../../../lib/supabase';

interface HolidaySubmission {
  id: string;
  first_name: string;
  last_name: string;
  created_at: string;
  comments: string | null;
  holiday_shifts: Array<{
    holiday_date: string;
    compensation_type: string;
  }>;
}

interface HolidaySubmissionsListProps {
  submissions: HolidaySubmission[];
  onDelete: (id: string) => void;
}

export function HolidaySubmissionsList({ submissions, onDelete }: HolidaySubmissionsListProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<HolidaySubmission | null>(null);

  const handleUpdate = async () => {
    try {
      const { data, error } = await supabase
        .from('holiday_submissions')
        .select(`
          *,
          holiday_shifts (
            holiday_date,
            compensation_type
          )
        `)
        .eq('id', selectedSubmission?.id)
        .single();

      if (error) throw error;

      // Actualizar el submission seleccionado con los nuevos datos
      if (data) {
        setSelectedSubmission(data);
      }
    } catch (error) {
      console.error('Error updating submission:', error);
    }
  };

  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="hidden md:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((submission) => (
                <tr
                  key={submission.id}
                  onClick={() => setSelectedSubmission(submission)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {submission.first_name} {submission.last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(submission.created_at)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden">
          <ul className="divide-y divide-gray-200">
            {submissions.map((submission) => (
              <li
                key={submission.id}
                onClick={() => setSelectedSubmission(submission)}
                className="p-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-900">
                    {submission.first_name} {submission.last_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(submission.created_at)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {selectedSubmission && (
        <HolidaySubmissionModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onDelete={onDelete}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
}