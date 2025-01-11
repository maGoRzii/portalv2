import React from 'react';
import { useTaskGroups } from '../../../hooks/useTaskGroups';

interface TaskGroupFilterProps {
  onGroupChange: (groupId: string) => void;
  selectedGroup: string;
}

export function TaskGroupFilter({ onGroupChange, selectedGroup }: TaskGroupFilterProps) {
  const { groups, loading } = useTaskGroups();

  if (loading) return null;

  return (
    <select
      value={selectedGroup}
      onChange={(e) => onGroupChange(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-lg text-sm
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="">Todas las agrupaciones</option>
      {groups.map(group => (
        <option key={group.id} value={group.id}>
          {group.name}
        </option>
      ))}
    </select>
  );
}