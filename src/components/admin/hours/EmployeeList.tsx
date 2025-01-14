import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { Employee } from '../../../types/hours';
import { EmployeeHoursModal } from './EmployeeHoursModal';
import { HoursFilters } from './HoursFilters';

interface EmployeeListProps {
  employees: Employee[];
  records: any[];
  onRecordsUpdate: () => void;
}

export function EmployeeList({ employees, records, onRecordsUpdate }: EmployeeListProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [balanceFilter, setBalanceFilter] = useState<'all' | 'positive' | 'negative'>('all');
  const [pendingHolidaysOnly, setPendingHolidaysOnly] = useState(false);

  const getEmployeeBalance = (employeeId: string) => {
    const employeeRecords = records.filter(record => record.employee_id === employeeId);
    return employeeRecords.reduce((sum, record) => sum + record.balance, 0);
  };

  const getEmployeeHolidayBalance = (employeeId: string) => {
    const employeeRecords = records.filter(record => record.employee_id === employeeId);
    return employeeRecords.reduce((sum, record) => {
      if (record.pending_holiday) return sum + 1;
      if (record.returned_holiday) return sum - 1;
      return sum;
    }, 0);
  };

  const getRowStyle = (employee: Employee, balance: number) => {
    let baseStyle = 'cursor-pointer transition-all duration-200 ';
    
    // Add purple border for 40h contract employees
    if (employee.contract_hours === 40) {
      baseStyle += 'border-l-4 border-purple-400 ';
    }
    
    // Add background color based on balance
    if (balance > 0) {
      baseStyle += 'bg-green-50 hover:bg-green-100';
    } else if (balance < 0) {
      baseStyle += 'bg-red-50 hover:bg-red-100';
    } else {
      baseStyle += 'hover:bg-gray-50';
    }
    
    return baseStyle;
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 40) return 'text-red-600';
    if (balance > 20) return 'text-yellow-600';
    if (balance > 0) return 'text-green-600';
    return 'text-gray-600';
  };

  const getHolidayBalanceColor = (balance: number) => {
    if (balance > 0) return 'text-purple-600';
    if (balance < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  // Get unique groups from employees
  const groups = Array.from(new Set(employees.map(emp => emp.group).filter(Boolean))).sort();

  // Filter employees
  const filteredEmployees = employees
    .filter(emp => emp.status === 'active')
    .filter(emp => {
      const matchesSearch = emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.employee_number?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGroup = !selectedGroup || emp.group === selectedGroup;
      const balance = getEmployeeBalance(emp.id);
      const matchesBalance = balanceFilter === 'all' ||
                           (balanceFilter === 'positive' && balance > 0) ||
                           (balanceFilter === 'negative' && balance < 0);
      const holidayBalance = getEmployeeHolidayBalance(emp.id);
      const matchesPendingHolidays = !pendingHolidaysOnly || holidayBalance > 0;

      return matchesSearch && matchesGroup && matchesBalance && matchesPendingHolidays;
    });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGroup('');
    setBalanceFilter('all');
    setPendingHolidaysOnly(false);
  };

  return (
    <>
      <HoursFilters
        groups={groups}
        searchTerm={searchTerm}
        selectedGroup={selectedGroup}
        balanceFilter={balanceFilter}
        pendingHolidaysOnly={pendingHolidaysOnly}
        onSearchChange={setSearchTerm}
        onGroupChange={setSelectedGroup}
        onBalanceFilterChange={setBalanceFilter}
        onPendingHolidaysChange={setPendingHolidaysOnly}
        onClearFilters={clearFilters}
      />

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empleado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Puesto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agrupación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance Horas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance Festivos
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => {
                const hoursBalance = getEmployeeBalance(employee.id);
                const holidayBalance = getEmployeeHolidayBalance(employee.id);
                return (
                  <tr
                    key={employee.id}
                    className={getRowStyle(employee, hoursBalance)}
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
                      <div className="text-sm text-gray-500">
                        {employee.group || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className={`text-sm font-medium ${getBalanceColor(hoursBalance)}`}>
                          {hoursBalance}h
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">
                        <span className={`${getHolidayBalanceColor(holidayBalance)}`}>
                          {holidayBalance > 0 
                            ? `${holidayBalance} pendiente${holidayBalance > 1 ? 's' : ''}`
                            : holidayBalance < 0 
                              ? `${Math.abs(holidayBalance)} devuelto${Math.abs(holidayBalance) > 1 ? 's' : ''}`
                              : '-'}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedEmployee && (
        <EmployeeHoursModal
          employee={selectedEmployee}
          records={records}
          onClose={() => setSelectedEmployee(null)}
          onUpdate={onRecordsUpdate}
        />
      )}
    </>
  );
}