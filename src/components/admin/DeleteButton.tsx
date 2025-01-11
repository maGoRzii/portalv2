import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface DeleteButtonProps {
  onDelete: () => Promise<void>;
  label?: string;
}

export function DeleteButton({ onDelete, label = 'Eliminar' }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este registro? Esta acción no se puede deshacer.')) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete();
      toast.success('Registro eliminado correctamente');
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('Error al eliminar el registro');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDeleting}
      className="inline-flex items-center px-3 py-2 border border-transparent text-sm 
               font-medium rounded-md text-white bg-red-600 hover:bg-red-700
               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
               disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Trash2 className="h-4 w-4 mr-2" />
      {isDeleting ? 'Eliminando...' : label}
    </button>
  );
}