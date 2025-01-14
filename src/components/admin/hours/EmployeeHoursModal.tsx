import React, { useState } from 'react';
import { X, Calendar, Users, Clock, Trash2, Plus, Edit2 } from 'lucide-react';
import { formatDate } from '../../../utils/date';
import { Employee, HoursRecord } from '../../../types/hours';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';

interface EmployeeHoursModalProps {
  employee: Employee;
  records: HoursRecord[];
  onClose: () => void;
  onUpdate?: () => void;
}

export function EmployeeHoursModal({ employee, records, onClose, onUpdate }: EmployeeHoursModalProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingRecord, setEditingRecord] = useState<HoursRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    extra_hours: 0,
    returned_hours: 0,
    paid_hours: 0,
    pending_holiday: false,
    returned_holiday: false
  });

  const employeeRecords = records
    .filter(record => record.employee_id === employee.id)
    .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());

  const totalBalance = employeeRecords.reduce((sum, record) => sum + record.balance, 0);
  const totalExtra = employeeRecords.reduce((sum, record) => sum + record.extra_hours, 0);
  const totalReturned = employeeRecords.reduce((sum, record) => sum + record.returned_hours, 0);
  const totalPaid = employeeRecords.reduce((sum, record) => sum + record.paid_hours, 0);
  const totalPendingHolidays = employeeRecords.filter(record => record.pending_holiday).length;
  const totalReturnedHolidays = employeeRecords.filter(record => record.returned_holiday).length;

  const getBalanceColor = (balance: number) => {
    if (balance > 40) return 'text-red-600';
    if (balance > 20) return 'text-yellow-600';
    if (balance > 0) return 'text-green-600';
    return 'text-gray-600';
  };

  const handleDelete = async (recordId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('hours_records')
        .delete()
        .eq('id', recordId);

      if (error) throw error;

      if (onUpdate) {
        onUpdate();
      }

      toast.success('Registro eliminado correctamente');
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('Error al eliminar el registro');
    }
  };

  const handleEdit = (record: HoursRecord) => {
    setEditingRecord(record);
    setFormData({
      start_date: record.start_date,
      end_date: record.end_date,
      extra_hours: record.extra_hours,
      returned_hours: record.returned_hours,
      paid_hours: record.paid_hours,
      pending_holiday: record.pending_holiday,
      returned_holiday: record.returned_holiday
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingRecord) {
        // Update existing record
        const { error } = await supabase
          .from('hours_records')
          .update({
            start_date: formData.start_date,
            end_date: formData.end_date,
            extra_hours: formData.extra_hours,
            returned_hours: formData.returned_hours,
            paid_hours: formData.paid_hours,
            pending_holiday: formData.pending_holiday,
            returned_holiday: formData.returned_holiday
          })
          .eq('id', editingRecord.id);

        if (error) throw error;
        toast.success('Registro actualizado correctamente');
        setEditingRecord(null);
      } else {
        // Create new record
        const { error } = await supabase
          .from('hours_records')
          .insert({
            employee_id: employee.id,
            ...formData
          });

        if (error) throw error;
        toast.success('Registro añadido correctamente');
        setIsAdding(false);
      }

      if (onUpdate) {
        await onUpdate();
      }

      setFormData({
        start_date: '',
        end_date: '',
        extra_hours: 0,
        returned_hours: 0,
        paid_hours: 0,
        pending_holiday: false,
        returned_holiday: false
      });
    } catch (error) {
      console.error('Error saving record:', error);
      toast.error('Error al guardar el registro');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
      <div className="grid grid-cols-2 gap-4 mb-4">
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
            Horas Extra
          </label>
          <input
            type="number"
            value={formData.extra_hours}
            onChange={(e) => setFormData(prev => ({ ...prev, extra_hours: Number(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            step="0.5"
            min="0"
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
            step="0.5"
            min="0"
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
            step="0.5"
            min="0"
            required
          />
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.pending_holiday}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              pending_holiday: e.target.checked,
              returned_holiday: e.target.checked ? false : prev.returned_holiday
            }))}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <span className="text-sm text-gray-700">Debo un día festivo</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.returned_holiday}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              returned_holiday: e.target.checked,
              pending_holiday: e.target.checked ? false : prev.pending_holiday
            }))}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <span className="text-sm text-gray-700">Devuelvo un día festivo</span>
        </label>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            setIsAdding(false);
            setEditingRecord(null);
            setFormData({
              start_date: '',
              end_date: '',
              extra_hours: 0,
              returned_hours: 0,
              paid_hours: 0,
              pending_holiday: false,
              returned_holiday: false
            });
          }}
          className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Guardando...' : editingRecord ? 'Actualizar' : 'Guardar'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                {employee.full_name}
              </h2>
              {employee.employee_number && (
                <p className="text-sm text-gray-500 mt-1">
                  Nº Empleado: {employee.employee_number}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-6 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Total Horas Extra</p>
              <p className="text-lg font-medium text-green-600">{totalExtra}h</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Total Horas Devueltas</p>
              <p className="text-lg font-medium text-blue-600">{totalReturned}h</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Total Horas Pagadas</p>
              <p className="text-lg font-medium text-orange-600">{totalPaid}h</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Balance Total</p>
              <p className={`text-lg font-medium ${getBalanceColor(totalBalance)}`}>
                {totalBalance}h
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Festivos Pendientes</p>
              <p className="text-lg font-medium text-purple-600">{totalPendingHolidays}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Festivos Devueltos</p>
              <p className="text-lg font-medium text-green-600">{totalReturnedHolidays}</p>
            </div>
          </div>

          {/* Add Record Button */}
          <div className="mb-6">
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm 
                       font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Añadir Registro
            </button>
          </div>

          {/* Add/Edit Form */}
          {(isAdding || editingRecord) && renderForm()}

          {/* Records Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Inicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Fin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    H. Extra
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    H. Devueltas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    H. Pagadas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Festivo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employeeRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(record.start_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(record.end_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {record.extra_hours}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      {record.returned_hours}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">
                      {record.paid_hours}h
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getBalanceColor(record.balance)}`}>
                      {record.balance}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {record.pending_holiday ? (
                        <span className="text-purple-600">Pendiente</span>
                      ) : record.returned_holiday ? (
                        <span className="text-green-600">Devuelto</span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(record)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}