import React from 'react';

interface TaskGroupBadgeProps {
  name: string;
  color: string;
}

export function TaskGroupBadge({ name, color }: TaskGroupBadgeProps) {
  return (
    <span 
      className="text-xs px-2 py-1 rounded-full inline-block font-medium"
      style={{ 
        backgroundColor: `${color}15`,
        color: color,
        borderWidth: '1px',
        borderColor: `${color}30`
      }}
    >
      {name}
    </span>
  );
}