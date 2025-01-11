import React from 'react';

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}

export function MenuItem({ icon, title, description, onClick, disabled }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-6 rounded-lg border transition-all duration-200 text-left
                ${disabled 
                  ? 'bg-gray-50 cursor-not-allowed opacity-50 border-gray-200' 
                  : 'bg-gradient-to-b from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 border-gray-200'}`}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-gradient-subtle hover:bg-gradient-subtle-hover text-white">
          {React.cloneElement(icon as React.ReactElement, {
            className: "h-6 w-6"
          })}
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </button>
  );
}