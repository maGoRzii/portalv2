import React, { useState, useEffect } from 'react';
import { Users, Plus, UserCheck, UserMinus, Clock, Download } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Employee } from '../../../types/hours';
import { EmployeeForm } from './EmployeeForm';
import { EmployeeTable } from './EmployeeTable';
import { EmployeeFilters } from './EmployeeFilters';
import { generateEmployeesPDF } from '../../../utils/employeePdf';
import { NotificationBell } from './NotificationBell';
import { useEmployeeStatusCheck } from '../../../hooks/useEmployeeStatusCheck';

// Define available groups and positions
const GROUPS = [
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
].sort();

const POSITIONS = [
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
].sort();

export function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [modifications, setModifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Use the status check hook
  useEmployeeStatusCheck();

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    loadEmployees();
    loadModifications();
  }, []);

  const loadEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('full_name');

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Error al cargar los empleados');
    } finally {
      setLoading(false);
    }
  };

  const loadModifications = async () => {
    try {
      const { data, error } = await supabase
        .from('contract_hours_modifications')
        .select(`
          *,
          employees!inner (
            full_name
          )
        `)
        .order('end_date');

      if (error) throw error;
      setModifications(data || []);
    } catch (error) {
      console.error('Error loading modifications:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Empleado eliminado correctamente');
      loadEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Error al eliminar el empleado');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGroup('');
    setSelectedPosition('');
    setSelectedStatus('');
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employee_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = !selectedGroup || employee.group === selectedGroup;
    const matchesPosition = !selectedPosition || employee.position === selectedPosition;
    const matchesStatus = !selectedStatus || employee.status === selectedStatus;

    return matchesSearch && matchesGroup && matchesPosition && matchesStatus;
  });

  const handleExportPDF = () => {
    generateEmployeesPDF(filteredEmployees);
    toast.success('Listado de empleados exportado correctamente');
  };

  // Count employees by status
  const activeEmployeesCount = employees.filter(emp => emp.status === 'active').length;
  const futureLeaveCount = employees.filter(emp => emp.status === 'future_leave').length;
  const inactiveCount = employees.filter(emp => emp.status === 'inactive').length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Gestión de Empleados
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell 
            employees={employees}
            modifications={modifications}
          />
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center px-4 py-2 border border-transparent 
                     rounded-md shadow-sm text-sm font-medium text-white 
                     bg-green-600 hover:bg-green-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent 
                     rounded-md shadow-sm text-sm font-medium text-white 
                     bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Añadir Empleado
          </button>
        </div>
      </div>

      {/* Employee Status Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Active Employees */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Empleados Activos</h3>
              <p className="text-2xl font-semibold text-gray-900">{activeEmployeesCount}</p>
            </div>
          </div>
        </div>

        {/* Future Leave */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Baja a Futuro</h3>
              <p className="text-2xl font-semibold text-gray-900">{futureLeaveCount}</p>
            </div>
          </div>
        </div>

        {/* Inactive */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100">
              <UserMinus className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Baja</h3>
              <p className="text-2xl font-semibold text-gray-900">{inactiveCount}</p>
            </div>
          </div>
        </div>
      </div>

      {(isAdding || editingEmployee) ? (
        <EmployeeForm
          employee={editingEmployee}
          onSubmit={() => {
            setIsAdding(false);
            setEditingEmployee(null);
            loadEmployees();
          }}
          onCancel={() => {
            setIsAdding(false);
            setEditingEmployee(null);
          }}
        />
      ) : (
        <>
          <EmployeeFilters
            groups={GROUPS}
            positions={POSITIONS}
            searchTerm={searchTerm}
            selectedGroup={selectedGroup}
            selectedPosition={selectedPosition}
            selectedStatus={selectedStatus}
            onSearchChange={setSearchTerm}
            onGroupChange={setSelectedGroup}
            onPositionChange={setSelectedPosition}
            onStatusChange={setSelectedStatus}
            onClearFilters={clearFilters}
          />

          <EmployeeTable
            employees={filteredEmployees}
            onEdit={setEditingEmployee}
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
}