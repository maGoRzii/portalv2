import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { useTrainingGroups } from '../hooks/useTrainingGroups';
import { MenuItem } from '../components/MenuItem';
import { BackButton } from '../components/BackButton';

export function TrainingGroupsPage() {
  const { groups, loading } = useTrainingGroups();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
          <h1 className="text-3xl font-light text-gray-900">Formación</h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <MenuItem
              key={group.id}
              icon={<GraduationCap />}
              title={group.name}
              description={group.description || `Formación específica de ${group.name}`}
              onClick={() => navigate(`/training/${group.slug}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}