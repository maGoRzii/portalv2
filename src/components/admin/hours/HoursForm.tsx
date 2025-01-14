import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../../lib/supabase';
import { Employee, HoursFormData } from '../../../types/hours';

interface HoursFormProps {
  employees: Employee[];
  onSubmit: () => void;
  onCancel: () => void;
}

export function HoursForm({ employees, onSubmit, onCancel }: HoursFormProps) {
  const [formData, setFormData] = useState<HoursFormData>({
    employee_id: '',
    week_code: '',
    start_date: '',
    end_date: '',
    extra_hours: 0,
    returned_hours: 0,
    paid_hours: 0
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.employee_id || !formData.start_date || !formData.end_date) {
      toast.error('Por favor, completa todos los campos obligatorios');
      return;
    }

    if (formData.extra_hours > 20) {
      const confirm = window.confirm(
        '¿Estás seguro de que quieres registrar más de 20 horas complementarias?'
      );
      if (!confirm) return;
    }

    setLoading(true);
    try {
      const balance = formData.extra_hours - formData.returned_hours - formData.paid_hours;
      
      const { error } = await supabase
        .from('hours_records')
        .insert({
          ...formData,
          balance
        });

      if (error) throw error;

      toast.success('Registro guardado correctamente');
      onSubmit();
    } catch (error) {
      console.error('Error saving record:', error);
      toast.error('Error al guardar el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Empleado
          </label>
          <select
            value={formData.employee_id}
            onChange={(e) => setFormData(prev => ({ ...prev, employee_id: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Seleccionar empleado</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>
                {employee.full_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código de Semana
          </label>
          <input
            type="text"
            value={formData.week_code}
            onChange={(e) => setFormData(prev => ({ ...prev, week_code: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: W01-2025"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Inicio
          </label>
          <input
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Fin
          </label>
          <input
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Horas Complementarias
          </label>
          <input
            type="number"
            value={formData.extra_hours}
            onChange={(e) => setFormData(prev => ({ ...prev, extra_hours: Number(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            min="0"
            step="0.5"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Horas Devueltas
          </label>
          <input
            type="number"
            value={formData.returned_hours}
            onChange={(e) => setFormData(prev => ({ ...prev, returned_hours: Number(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            min="0"
            step="0.5"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Horas Pagadas
          </label>
          <input
            type="number"
            value={formData.paid_hours}
            onChange={(e) => setFormData(prev => ({ ...prev, paid_hours: Number(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            min="0"
            step="0.5"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                   rounded-lg hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent 
                   rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}