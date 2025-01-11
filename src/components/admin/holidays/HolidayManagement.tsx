import React, { useState } from 'react';
import { Calendar, Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { HOLIDAYS } from '../../../data/holidays';

interface Holiday {
  date: string;
  name: string;
}

interface HolidayManagementProps {
  onUpdate: () => void;
}

export function HolidayManagement({ onUpdate }: HolidayManagementProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [newHoliday, setNewHoliday] = useState<Holiday>({ date: '', name: '' });

  const handleAdd = async () => {
    try {
      if (!newHoliday.date || !newHoliday.name) {
        toast.error('Por favor, completa todos los campos');
        return;
      }

      const { error } = await supabase
        .from('holidays')
        .insert([newHoliday]);

      if (error) throw error;

      toast.success('Festivo añadido correctamente');
      setIsAdding(false);
      setNewHoliday({ date: '', name: '' });
      onUpdate();
    } catch (error) {
      console.error('Error adding holiday:', error);
      toast.error('Error al añadir el festivo');
    }
  };

  const handleEdit = async () => {
    try {
      if (!editingHoliday?.date || !editingHoliday?.name) {
        toast.error('Por favor, completa todos los campos');
        return;
      }

      const { error } = await supabase
        .from('holidays')
        .update(editingHoliday)
        .eq('date', editingHoliday.date);

      if (error) throw error;

      toast.success('Festivo actualizado correctamente');
      setEditingHoliday(null);
      onUpdate();
    } catch (error) {
      console.error('Error updating holiday:', error);
      toast.error('Error al actualizar el festivo');
    }
  };

  const handleDelete = async (date: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este festivo?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('holidays')
        .delete()
        .eq('date', date);

      if (error) throw error;

      toast.success('Festivo eliminado correctamente');
      onUpdate();
    } catch (error) {
      console.error('Error deleting holiday:', error);
      toast.error('Error al eliminar el festivo');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Gestión de Festivos
          </h2>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent 
                   rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 
                   hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Añadir Festivo
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Nuevo Festivo</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha
              </label>
              <input
                type="date"
                value={newHoliday.date}
                onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                         focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                value={newHoliday.name}
                onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                         focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                         text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm 
                         text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {HOLIDAYS.map((holiday) => (
              <tr key={holiday.date}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(holiday.date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingHoliday?.date === holiday.date ? (
                    <input
                      type="text"
                      value={editingHoliday.name}
                      onChange={(e) => setEditingHoliday({ ...editingHoliday, name: e.target.value })}
                      className="block w-full rounded-md border-gray-300 shadow-sm 
                               focus:border-blue-500 focus:ring-blue-500"
                    />
                  ) : (
                    holiday.name
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editingHoliday?.date === holiday.date ? (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingHoliday(null)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleEdit}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Guardar
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingHoliday(holiday)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(holiday.date)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}