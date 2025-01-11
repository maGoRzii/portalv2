import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { TrainingGroup } from '../../../types/training';

interface TrainingGroupRowProps {
  group: TrainingGroup;
}

export function TrainingGroupRow({ group }: TrainingGroupRowProps) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/admin/training/${group.slug}`)}
      className="p-4 sm:p-6 hover:bg-gray-50 cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate">
            {group.name}
          </h3>
          {group.description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2 sm:line-clamp-none">
              {group.description}
            </p>
          )}
        </div>
        <ChevronRight className="flex-shrink-0 h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
}