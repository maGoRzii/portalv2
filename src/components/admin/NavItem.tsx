import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  disabled?: boolean;
}

export function NavItem({ icon, label, path, disabled }: NavItemProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname === path;

  return (
    <button
      onClick={() => !disabled && navigate(path)}
      disabled={disabled}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-blue-50 text-blue-600' 
                  : disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-50'}`}
    >
      {React.cloneElement(icon as React.ReactElement, {
        className: `h-5 w-5 ${isActive ? 'text-blue-600' : disabled ? 'text-gray-400' : 'text-gray-500'}`
      })}
      <span className="font-medium">{label}</span>
    </button>
  );
}