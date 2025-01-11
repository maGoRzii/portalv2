import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

export function BackHomeButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/')}
      className="fixed top-4 left-4 bg-gradient-subtle hover:bg-gradient-subtle-hover text-white px-4 py-2 
                 rounded-lg transition-all duration-200 flex items-center gap-2"
    >
      <Home className="h-4 w-4 stroke-[1.5]" />
      <span>Inicio</span>
    </button>
  );
}