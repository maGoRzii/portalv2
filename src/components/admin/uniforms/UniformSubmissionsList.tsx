import React, { useState } from 'react';
import { formatDate } from '../../../utils/date';
import { UniformSubmissionModal } from './UniformSubmissionModal';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';

interface UniformSubmissionsListProps {
  submissions: any[];
  onDelete: (id: string) => void;
}

export function UniformSubmissionsList({ submissions, onDelete }: UniformSubmissionsListProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('uniform_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      onDelete(id);
      toast.success('Solicitud eliminada correctamente');
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast.error('Error al eliminar la solicitud');
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
        <UniformSubmissionModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}