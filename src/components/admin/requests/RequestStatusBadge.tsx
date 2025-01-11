import React from 'react';
import { RequestStatus } from '../../../types/request';

interface RequestStatusBadgeProps {
  status: RequestStatus;
}

export function RequestStatusBadge({ status }: RequestStatusBadgeProps) {
  const getBadgeColor = (status: RequestStatus) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getLabel = (status: RequestStatus) => {
    switch (status) {
      case 'done':
        return 'Hecho';
      case 'pending':
      default:
        return 'Pendiente';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(status)}`}>
      {getLabel(status)}
    </span>
  );
}