import React, { useState, useEffect } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Employee, ContractHoursModification } from '../../../types/hours';
import { EmployeeDetailsModal } from './EmployeeDetailsModal';
import { supabase } from '../../../lib/supabase';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

export function EmployeeTable({ employees, onEdit, onDelete }: EmployeeTableProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [hoursModifications, setHoursModifications] = useState<Record<string, ContractHoursModification[]>>({});

  useEffect(() => {
    loadHoursModifications();
  }, [employees]);

  const loadHoursModifications = async () => {
    try {
      const { data, error } = await supabase
        .from('contract_hours_modifications')
        .select('*')
        .in('employee_id', employees.map(e => e.id))
        .order('start_date', { ascending: false });

      if (error) throw error;

      // Group modifications by employee_id
      const modsByEmployee = (data || []).reduce((acc, mod) => {
        if (!acc[mod.employee_id]) {
          acc[mod.employee_id] = [];
        }
        acc[mod.employee_id].push(mod);
        return acc;
      }, {} as Record<string, ContractHoursModification[]>);

      setHoursModifications(modsByEmployee);
    } catch (error) {
      console.error('Error loading hours modifications:', error);
    }
  };

  const getActiveModification = (employeeId: string): ContractHoursModification | null => {
    const mods = hoursModifications[employeeId] || [];
    const today = new Date().toISOString().split('T')[0];
    
    return mods.find(mod => {
      const startDate = new Date(mod.start_date).toISOString().split('T')[0];
      const endDate = mod.end_date ? new Date(mod.end_date).toISOString().split('T')[0] : null;
      return startDate <= today && (!endDate || endDate >= today);
    }) || null;
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
      onDelete(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'future_leave':
        return 'bg-orange-50 hover:bg-orange-100';
      case 'inactive':
        return 'bg-red-50 hover:bg-red-100';
      default:
        return 'hover:bg-gray-50';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'future_leave':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
            Baja a futuro
          </span>
        );
      case 'inactive':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
            Baja
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Puesto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agrupación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee) => {
                const activeMod = getActiveModification(employee.id);
                return (
                  <tr 
                    key={employee.id} 
                    className={`cursor-pointer ${getStatusColor(employee.status)}`}
                    onClick={() => setSelectedEmployee(employee)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.full_name}
                        </div>
                        {employee.employee_number && (
                          <div className="text-sm text-gray-500">
                            {employee.employee_number}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {employee.position_code && (
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-md mr-2">
                            {employee.position_code}
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          {employee.position || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {employee.contract_hours && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">{employee.contract_hours}h</span>
                            {activeMod && (
                              <>
                                <span className="text-gray-400">→</span>
                                <span className="font-medium text-blue-600">{activeMod.hours_change}h</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {employee.group || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(employee.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {employee.email && (
                          <div>{employee.email}</div>
                        )}
                        {employee.phone && (
                          <div className="text-gray-400">{employee.phone}</div>
                        )}
                        {!employee.email && !employee.phone && '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(employee);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(employee.id);
                        }}
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

      {selectedEmployee && (
        <EmployeeDetailsModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          onEdit={(employee) => {
            onEdit(employee);
            setSelectedEmployee(null);
          }}
        />
      )}
    </>
  );
}