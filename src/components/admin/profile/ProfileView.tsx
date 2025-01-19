import React, { useState, useEffect } from 'react';
import { UserCircle, Calendar, CreditCard } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabase';
import { Employee } from '../../../types/hours';

export function ProfileView() {
  const { user } = useAuth();
  const [employeeData, setEmployeeData] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.user_metadata?.employee_id) {
      loadEmployeeData(user.user_metadata.employee_id);
    }
  }, [user]);

  const loadEmployeeData = async (employeeId: string) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', employeeId)
        .single();

      if (error) throw error;
      setEmployeeData(data);
    } catch (error) {
      console.error('Error loading employee data:', error);
    } finally {
      setLoading(false);
    }
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
      <div className="flex items-center gap-2">
        <UserCircle className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Mi Perfil</h2>
      </div>

      {/* Personal Information */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900">Información Personal</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Nombre y apellidos</dt>
              <dd className="mt-1 text-sm text-gray-900">{employeeData?.full_name || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Número de empleado</dt>
              <dd className="mt-1 text-sm text-gray-900">{employeeData?.employee_number || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Horas de contrato</dt>
              <dd className="mt-1 text-sm text-gray-900">{employeeData?.contract_hours ? `${employeeData.contract_hours}h` : '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Agrupación</dt>
              <dd className="mt-1 text-sm text-gray-900">{employeeData?.group || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
              <dd className="mt-1 text-sm text-gray-900">{employeeData?.phone || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{user?.email || '-'}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900">Calendario Laboral</h3>
            </div>
            <p className="text-sm text-gray-500">
              Consulta tu calendario laboral y gestiona tus horarios.
            </p>
            <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Ver Calendario
            </button>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900">Tarjeta de Fichar</h3>
            </div>
            <p className="text-sm text-gray-500">
              Gestiona tu tarjeta de fichar y consulta tus registros.
            </p>
            <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Ver Tarjeta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}