import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Check } from 'lucide-react';
import { Employee } from '../../../types/hours';
import { VacationRecord, VacationFormData } from '../../../types/vacation';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';

interface VacationModalProps {
  employee: Employee;
  onClose: () => void;
}

export function VacationModal({ employee, onClose }: VacationModalProps) {
  const [records, setRecords] = useState<VacationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingRecord, setEditingRecord] = useState<VacationRecord | null>(null);
  const [formData, setFormData] = useState<VacationFormData>({
    year: new Date().getFullYear(),
    days_taken: undefined,
    days_remaining: undefined
  });

  useEffect(() => {
    loadRecords();
  }, [employee.id]);

  const loadRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('vacation_records')
        .select('*')
        .eq('employee_id', employee.id)
        .order('year', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error loading vacation records:', error);
      toast.error('Error al cargar los registros de vacaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.days_taken && !formData.days_remaining) {
      toast.error('Debes introducir al menos un valor');
      return;
    }

    try {
      if (editingRecord) {
        // Update existing record
        const { error } = await supabase
          .from('vacation_records')
          .update({
            year: formData.year,
            days_taken: formData.days_taken || 0,
            days_remaining: formData.days_remaining || 0
          })
          .eq('id', editingRecord.id);

        if (error) throw error;
        toast.success('Registro actualizado correctamente');
      } else {
        // Create new record
        const { error } = await supabase
          .from('vacation_records')
          .insert({
            employee_id: employee.id,
            year: formData.year,
            days_taken: formData.days_taken || 0,
            days_remaining: formData.days_remaining || 0
          });

        if (error) throw error;
        toast.success('Registro guardado correctamente');
      }

      setIsAdding(false);
      setEditingRecord(null);
      loadRecords();
    } catch (error) {
      console.error('Error saving vacation record:', error);
      toast.error('Error al guardar el registro');
    }
  };

  const handleEdit = (record: VacationRecord) => {
    setEditingRecord(record);
    setFormData({
      year: record.year,
      days_taken: record.days_taken,
      days_remaining: record.days_remaining
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingRecord(null);
    setFormData({
      year: new Date().getFullYear(),
      days_taken: undefined,
      days_remaining: undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Vacaciones</h2>
              <p className="text-sm text-gray-500 mt-1">{employee.full_name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {(isAdding || editingRecord) ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Año
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {[...Array(5)].map((_, i) => {
                    const year = new Date().getFullYear() - 2 + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Días disfrutados
                </label>
                <input
                  type="number"
                  value={formData.days_taken || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, days_taken: parseInt(e.target.value) }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Días pendientes
                </label>
                <input
                  type="number"
                  value={formData.days_remaining || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, days_remaining: parseInt(e.target.value) }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  {editingRecord ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          ) : (
            <>
              <button
                onClick={() => setIsAdding(true)}
                className="mb-4 inline-flex items-center px-4 py-2 border border-transparent 
                         rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 
                         hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Grabar Vacaciones
              </button>

              <div className="space-y-4">
                {records.map((record) => (
                  <div key={record.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-lg font-medium text-gray-900">
                        {record.year}
                      </div>
                      <button
                        onClick={() => handleEdit(record)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Días disfrutados</p>
                        <p className="text-lg font-medium text-green-600">{record.days_taken}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Días pendientes</p>
                        <p className="text-lg font-medium text-blue-600">{record.days_remaining}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {records.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    No hay registros de vacaciones
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}