import React from 'react';
import { Printer } from 'lucide-react';

interface PrintButtonProps {
  onClick: () => void;
  className?: string;
}

export function PrintButton({ onClick, className = '' }: PrintButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium 
               rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none 
               focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 no-print ${className}`}
    >
      <Printer className="h-4 w-4 mr-2" />
      Imprimir
    </button>
  );
}