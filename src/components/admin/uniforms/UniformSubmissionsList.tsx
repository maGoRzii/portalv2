import React from 'react';
import { UNIFORM_DATA } from '../../../data/uniforms';
import { DeleteButton } from '../DeleteButton';
import { supabase } from '../../../lib/supabase';

interface UniformSubmissionsListProps {
  submissions: any[];
  onDelete: (id: string) => void;
}

export function UniformSubmissionsList({ submissions, onDelete }: UniformSubmissionsListProps) {
  const getItemName = (itemId: string) => {
    for (const category of UNIFORM_DATA) {
      const item = category.items.find(item => item.id === itemId);
      if (item) return item.name;
    }
    return itemId;
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('uniform_requests')
      .delete()
      .eq('id', id);

    if (error) throw error;
    onDelete(id);
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {submissions.map((submission) => (
          <li key={submission.id} className="p-6 hover:bg-gray-50">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {submission.first_name} {submission.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(submission.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <DeleteButton onDelete={() => handleDelete(submission.id)} />
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Prendas solicitadas:</h4>
                <div className="grid gap-2">
                  {submission.uniform_items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{getItemName(item.item_id)}</span>
                      <span className="font-medium text-gray-900">{item.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}