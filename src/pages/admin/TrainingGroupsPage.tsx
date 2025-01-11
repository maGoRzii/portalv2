import React from 'react';
import { GraduationCap } from 'lucide-react';
import { TrainingGroupList } from '../../components/admin/training/TrainingGroupList';

export function TrainingGroupsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <GraduationCap className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Grupos de Formación
        </h2>
      </div>

      <TrainingGroupList />
    </div>
  );
}