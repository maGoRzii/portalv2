import React, { useState, useEffect } from 'react';
import { Clock, FileText } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { EmployeeList } from './EmployeeList';
import { exportHoursToCSV } from '../../../utils/export';

export function HoursManagement() {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load active employees
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('*')
        .eq('status', 'active')
        .order('full_name');

      if (employeesError) throw employeesError;

      // Load hours records
      const { data: recordsData, error: recordsError } = await supabase
        .from('hours_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (recordsError) throw recordsError;

      setEmployees(employeesData || []);
      setRecords(recordsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    exportHoursToCSV(records, employees, 'horas-complementarias');
    toast.success('Datos exportados correctamente');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Horas Complementarias
          </h2>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center px-4 py-2 border border-transparent 
                   rounded-md shadow-sm text-sm font-medium text-white bg-green-600 
                   hover:bg-green-700"
        >
          <FileText className="h-4 w-4 mr-2" />
          Exportar CSV
        </button>
      </div>

      <EmployeeList
        employees={employees}
        records={records}
        onRecordsUpdate={loadData}
      />
    </div>
  );
}