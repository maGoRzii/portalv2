import React from 'react';
import { useParams } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { TrainingEntryList } from '../components/training/TrainingEntryList';
import { useTrainingGroup } from '../hooks/useTrainingGroup';
import { BackButton } from '../components/BackButton';

export function TrainingGroupPage() {
  const { slug } = useParams<{ slug: string }>();
  const { group, entries, loading } = useTrainingGroup(slug || '');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Grupo no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <BackButton />
      
      <div className="max-w-6xl mx-auto mt-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-gradient-subtle">
            <GraduationCap className="h-6 w-6 text-white stroke-[1.5]" />
          </div>
          <div>
            <h1 className="text-3xl font-light text-gray-900">{group.name}</h1>
            {group.description && (
              <p className="mt-1 text-gray-600">{group.description}</p>
            )}
          </div>
        </div>

        <TrainingEntryList entries={entries} groupSlug={group.slug} />
      </div>
    </div>
  );
}