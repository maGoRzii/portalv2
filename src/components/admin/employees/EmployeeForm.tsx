import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../../lib/supabase';
import { Employee } from '../../../types/hours';

interface EmployeeFormProps {
  employee: Employee | null;
  onSubmit: () => void;
  onCancel: () => void;
}

export function EmployeeForm({ employee, onSubmit, onCancel }: EmployeeFormProps) {
  const [formData, setFormData] = useState<Partial<Employee>>(
    employee || {
      status: 'active'
    }
  );
  const [loading, setLoading] = useState(false);

  // Define and sort groups alphabetically
  const groups = [
    'Operaciones',
    'Caja',
    'Dirección',
    'Comercial Señora',
    'Comercial Caballero',
    'Comercial Niño',
    'Almacén Externo Tienda',
    'Almacén',
    'Probadores',
    'Grupo Sint'
  ].sort((a, b) => a.localeCompare(b, 'es'));

  // Define and sort positions alphabetically
  const positions = [
    'Adjunto de Dirección',
    'Cajero Central',
    'Cajero de Sección',
    'Comercial Sección Caballero',
    'Comercial Sección Niño',
    'Comercial Sección Señora',
    'Dependiente',
    'Director de Tienda',
    'Gestor de Operaciones',
    'Manager de Caballero',
    'Manager de Experiencia',
    'Manager de Niño',
    'Manager de Operaciones',
    'Manager de Señora'
  ].sort((a, b) => a.localeCompare(b, 'es'));

  // Define and sort leave reasons alphabetically
  const leaveReasons = [
    'Agotamiento I.T.',
    'Cambio de Contrato',
    'Despido',
    'Excd. por cuidado de descendiente - Plan de Igualdad',
    'Excd. por cuidado de familiar - Plan de Igualdad',
    'Excedencia especial de verano',
    'Excedencia plataforma',
    'Excedencia por adopción internacional',
    'Excedencia por cuidado de familiares',
    'Excedencia por cuidado de hijo',
    'Excedencia por estudios',
    'Excedencia por fall., acc., o enfermedad de cónyuje',
    'Excedencia por motivos personales',
    'Excedencia por plan COVID19',
    'Excedencia voluntaria',
    'Excedencia voluntaria convenio',
    'Fallecimiento',
    'Fin actividad fijos - discontinuos',
    'Fin de Contrato',
    'Fusión',
    'Incomparecencia',
    'Jubilación',
    'Nunca Trabajó',
    'Pensionista',
    'Periodo de prueba',
    'Periodo de prueba a instancia del trabajador',
    'Resolución trabajador por modificación sustancial',
    'Traslado',
    'Traslado - Intransit',
    'Voluntaria'
  ].sort((a, b) => a.localeCompare(b, 'es'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.employee_number) {
      toast.error('Por favor, completa los campos obligatorios');
      return;
    }

    if ((formData.status === 'inactive' || formData.status === 'future_leave') && 
        (!formData.leave_date || !formData.leave_reason)) {
      toast.error('Para dar de baja a un empleado, debes indicar la fecha y el motivo');
      return;
    }

    setLoading(true);
    try {
      if (employee) {
        const { error } = await supabase
          .from('employees')
          .update(formData)
          .eq('id', employee.id);

        if (error) throw error;
        toast.success('Empleado actualizado correctamente');
      } else {
        const { error } = await supabase
          .from('employees')
          .insert(formData);

        if (error) throw error;
        toast.success('Empleado añadido correctamente');
      }

      onSubmit();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar el empleado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nº Empleado <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.employee_number || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, employee_number: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.full_name || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Puesto
          </label>
          <select
            value={formData.position || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccionar puesto</option>
            {positions.map(position => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Agrupación
          </label>
          <select
            value={formData.group || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, group: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccionar agrupación</option>
            {groups.map(group => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Horas contrato
          </label>
          <input
            type="number"
            value={formData.contract_hours || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, contract_hours: Number(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            min="0"
            step="0.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            value={formData.status || 'active'}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Employee['status'] }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="active">Activo</option>
            <option value="future_leave">Baja a futuro</option>
            <option value="inactive">Baja</option>
          </select>
        </div>

        {(formData.status === 'inactive' || formData.status === 'future_leave') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de baja <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.leave_date || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, leave_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo de baja <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.leave_reason || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, leave_reason: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Seleccionar motivo</option>
                {leaveReasons.map(reason => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
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
          {loading ? 'Guardando...' : employee ? 'Actualizar' : 'Añadir'}
        </button>
      </div>
    </form>
  );
}