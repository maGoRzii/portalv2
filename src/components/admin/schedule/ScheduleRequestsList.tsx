import React from 'react';
import { formatDate } from '../../../utils/date';
import { DeleteButton } from '../DeleteButton';
import { supabase } from '../../../lib/supabase';

interface ScheduleRequestsListProps {
  requests: any[];
  onDelete: (id: string) => void;
}

export function ScheduleRequestsList({ requests, onDelete }: ScheduleRequestsListProps) {
  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('schedule_changes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    onDelete(id);
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <ul className="divide-y divide-gray-200">
        {requests.map((request) => (
          <li key={request.id} className="p-6 hover:bg-gray-50">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {request.first_name} {request.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(request.created_at)}
                  </p>
                </div>
                <DeleteButton onDelete={() => handleDelete(request.id)} />
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Mensaje:</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{request.message}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}