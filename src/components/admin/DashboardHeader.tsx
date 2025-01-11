import React from 'react';
import { LogOut } from 'lucide-react';

interface DashboardHeaderProps {
  onLogout: () => void;
}

export function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <h1 className="text-2xl font-light text-gray-900">
            Panel de Administración
          </h1>
          <button
            onClick={onLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg
                     text-sm font-medium text-white bg-gradient-subtle hover:bg-gradient-subtle-hover
                     transition-all duration-200"
          >
            <LogOut className="h-4 w-4 mr-2 stroke-[1.5]" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
}