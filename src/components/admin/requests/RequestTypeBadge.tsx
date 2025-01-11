import React from 'react';
import { REQUEST_TYPES } from '../../../types/request';

interface RequestTypeBadgeProps {
  type: string;
}

export function RequestTypeBadge({ type }: RequestTypeBadgeProps) {
  const requestType = REQUEST_TYPES.find(t => t.id === type);
  if (!requestType) return null;

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'schedule_change':
        return 'bg-blue-100 text-blue-800';
      case 'hours_return':
        return 'bg-purple-100 text-purple-800';
      case 'holiday_return':
        return 'bg-green-100 text-green-800';
      case 'medical':
        return 'bg-red-100 text-red-800';
      case 'personal':
        return 'bg-gray-100 text-gray-800';
      case 'clock_card':
        return 'bg-yellow-100 text-yellow-800';
      case 'talks':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(type)}`}>
      {requestType.label}
    </span>
  );
}