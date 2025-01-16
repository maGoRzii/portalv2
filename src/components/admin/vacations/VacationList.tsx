import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { Employee } from '../../../types/hours';
import { VacationModal } from './VacationModal';
import { VacationFilters } from './VacationFilters';
import { supabase } from '../../../lib/supabase';
import { VacationRecord } from '../../../types/vacation';
import { generateVacationPDF } from '../../../utils/vacationPdf';

interface VacationListProps {
  employees: Employee[];
}

export function VacationList({ employees }: VacationListProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const [vacationRecords, setVacationRecords] = useState<Record<string, VacationRecord[]>>({});
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Get unique groups from employees
  const groups = Array.from(new Set(employees.map(emp => emp.group).filter(Boolean))).sort();

  useEffect(() => {
    loadVacationRecords();
  }, [employees]);

  const loadVacationRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('vacation_records')
        .select('*')
        .in('employee_id', employees.map(e => e.id));

      if (error) throw error;

      // Group records by employee_id
      const recordsByEmployee = (data || []).reduce((acc, record) => {
        if (!acc[record.employee_id]) {
          acc[record.employee_id] = [];
        }
        acc[record.employee_id].push(record);
        return acc;
      }, {} as Record<string, VacationRecord[]>);

      setVacationRecords(recordsByEmployee);
    } catch (error) {
      console.error('Error loading vacation records:', error);
    }
  };

  const hasPendingVacations = (employeeId: string): boolean => {
    const records = vacationRecords[employeeId] || [];
    return records.some(record => record.days_remaining > 0);
  };

  const getRowStyle = (employee: Employee) => {
    const baseStyle = "hover:bg-gray-50 cursor-pointer ";
    return baseStyle + (hasPendingVacations(employee.id) ? "bg-red-50" : "");
  };

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = (emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.employee_number?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesGroup = !selectedGroup || emp.group === selectedGroup;
    const matchesPending = !showPendingOnly || hasPendingVacations(emp.id);

    return matchesSearch && matchesGroup && matchesPending;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGroup('');
    setShowPendingOnly(false);
  };

  const handleExportPDF = () => {
    generateVacationPDF(filteredEmployees, vacationRecords, selectedYear);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <VacationFilters
          groups={groups}
          searchTerm={searchTerm}
          selectedGroup={selectedGroup}
          showPendingOnly={showPendingOnly}
          onSearchChange={setSearchTerm}
          onGroupChange={setSelectedGroup}
          onPendingChange={setShowPendingOnly}
          onClearFilters={clearFilters}
        />

        <div className="flex items-center gap-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

          <button
            onClick={handleExportPDF}
            className="inline-flex items-center px-4 py-2 border border-transparent 
                     rounded-md shadow-sm text-sm font-medium text-white bg-green-600 
                     hover:bg-green-700"
          >
            <FileText className="h-4 w-4 mr-2" />
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nº Empleado
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
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.map((employee) => (
              <tr 
                key={employee.id}
                onClick={() => setSelectedEmployee(employee)}
                className={getRowStyle(employee)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {employee.full_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {employee.employee_number}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {employee.position || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {employee.contract_hours ? `${employee.contract_hours}h` : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {employee.group || '-'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedEmployee && (
        <VacationModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </>
  );
}