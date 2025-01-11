import React from 'react';
import { FileText, Calendar } from 'lucide-react';
import { TrainingEntry } from '../../types/training';
import { formatDate } from '../../utils/date';

interface TrainingEntryCardProps {
  entry: TrainingEntry;
  onClick: () => void;
}

export function TrainingEntryCard({ entry, onClick }: TrainingEntryCardProps) {
  return (
    <article
      onClick={onClick}
      className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 
                 hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">{entry.title}</h3>
        </div>
        {!entry.published && (
          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
            Borrador
          </span>
        )}
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
        <Calendar className="h-4 w-4" />
        <time dateTime={entry.created_at}>{formatDate(entry.created_at)}</time>
      </div>
    </article>
  );
}