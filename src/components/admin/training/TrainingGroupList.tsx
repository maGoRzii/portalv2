import React from 'react';
import { useTrainingGroups } from '../../../hooks/useTrainingGroups';
import { TrainingGroupRow } from './TrainingGroupRow';

export function TrainingGroupList() {
  const { groups, loading } = useTrainingGroups();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="divide-y divide-gray-200">
        {groups.map((group) => (
          <TrainingGroupRow key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
}