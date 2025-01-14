import React, { useState } from 'react';
import { EmployeeWithBalance, HoursRecord } from '../../../types/hours';
import { formatDate } from '../../../utils/date';
import { EmployeeHoursModal } from './EmployeeHoursModal';
import { Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';

interface HoursTableProps {
  employees: EmployeeWithBalance[];
  records: HoursRecord[];
  onUpdate: () => void;
}

export function HoursTable({ employees, records, onUpdate }: HoursTableProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [showingEmployee, setShowingEmployee] = useState<EmployeeWithBalance | null>(null);

  const filteredRecords = selectedEmployee
    ? records.filter(r => r.employee_id === selectedEmployee)
    : records;

  const getEmployeeName = (id: string) => {
    return employees.find(e => e.id === id)?.full_name || 'Desconocido';
  };

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
      toast.success('Registro eliminado correctamente');
      onUpdate();
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('Error al eliminar el registro');
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos los empleados</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>
                {employee.full_name} ({employee.total_balance}h)
              </option>
            ))}
          </select>
        </div>

        {/* Desktop view */}
        <div className="hidden md:block bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empleado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Semana
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Inicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Fin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    H. Comp.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    H. Dev.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    H. Pag.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((record) => {
                  const employee = employees.find(e => e.id === record.employee_id);
                  return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td 
                        className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-800"
                        onClick={() => employee && setShowingEmployee(employee)}
                      >
                        {getEmployeeName(record.employee_id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.week_code}
                      </td>
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
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile view */}
        <div className="md:hidden space-y-4">
          {filteredRecords.map((record) => {
            const employee = employees.find(e => e.id === record.employee_id);
            return (
              <div key={record.id} className="bg-white shadow rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div 
                    className="text-blue-600 font-medium cursor-pointer hover:text-blue-800"
                    onClick={() => employee && setShowingEmployee(employee)}
                  >
                    {getEmployeeName(record.employee_id)}
                  </div>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  Semana: {record.week_code}
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(record.start_date)} - {formatDate(record.end_date)}
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <span className="text-sm text-gray-500">H. Complementarias:</span>
                    <span className="ml-1 text-green-600">{record.extra_hours}h</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">H. Devueltas:</span>
                    <span className="ml-1 text-blue-600">{record.returned_hours}h</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">H. Pagadas:</span>
                    <span className="ml-1 text-orange-600">{record.paid_hours}h</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Balance:</span>
                    <span className={`ml-1 font-medium ${getBalanceColor(record.balance)}`}>
                      {record.balance}h
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showingEmployee && (
        <EmployeeHoursModal
          employee={showingEmployee}
          records={records}
          onClose={() => setShowingEmployee(null)}
        />
      )}
    </>
  );
}