import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrainingEntry } from '../../types/training';
import { TrainingEntryCard } from './TrainingEntryCard';

interface TrainingEntryListProps {
  entries: TrainingEntry[];
  groupSlug: string;
}

export function TrainingEntryList({ entries, groupSlug }: TrainingEntryListProps) {
  const navigate = useNavigate();

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No hay entradas de formación disponibles.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        <TrainingEntryCard
          key={entry.id}
          entry={entry}
          onClick={() => navigate(`/training/${groupSlug}/${entry.slug}`)}
        />
      ))}
    </div>
  );
}