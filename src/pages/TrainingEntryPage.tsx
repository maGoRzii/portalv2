import React from 'react';
import { useParams } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { TrainingContent } from '../components/training/TrainingContent';
import { useTrainingEntry } from '../hooks/useTrainingEntry';
import { BackButton } from '../components/BackButton';

export function TrainingEntryPage() {
  const { groupSlug, entrySlug } = useParams<{ groupSlug: string; entrySlug: string }>();
  const { entry, media, loading } = useTrainingEntry(groupSlug || '', entrySlug || '');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Entrada no encontrada</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <BackButton />
      
      <div className="max-w-4xl mx-auto mt-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-gradient-subtle">
            <GraduationCap className="h-6 w-6 text-white stroke-[1.5]" />
          </div>
          <h1 className="text-3xl font-light text-gray-900">{entry.title}</h1>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <TrainingContent content={entry.content} media={media} />
        </div>
      </div>
    </div>
  );
}