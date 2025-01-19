import React, { useState, useEffect } from 'react';
import { X, Edit2, User, Users, Clock, UserPlus, Link, Phone, Mail, Building, Briefcase, Trash2 } from 'lucide-react';
import { Employee, ContractHoursModification } from '../../../types/hours';
import { supabase } from '../../../lib/supabase';
import { formatDate } from '../../../utils/date';
import { CreateUserModal } from './CreateUserModal';
import { LinkUserModal } from './LinkUserModal';
import { toast } from 'react-hot-toast';

interface EmployeeDetailsModalProps {
  employee: Employee;
  onClose: () => void;
  onEdit: (employee: Employee) => void;
}

export function EmployeeDetailsModal({ employee, onClose, onEdit }: EmployeeDetailsModalProps) {
  const [hoursModifications, setHoursModifications] = useState<ContractHoursModification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModification, setShowAddModification] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showLinkUser, setShowLinkUser] = useState(false);
  const [linkedUser, setLinkedUser] = useState<{ id: string; email: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newModification, setNewModification] = useState({
    hours_change: 0,
    start_date: '',
    end_date: '',
    reason: ''
  });

  useEffect(() => {
    loadHoursModifications();
    loadLinkedUser();
  }, [employee.id]);

  const loadHoursModifications = async () => {
    try {
      const { data, error } = await supabase
        .from('contract_hours_modifications')
        .select('*')
        .eq('employee_id', employee.id)
        .order('start_date', { ascending: false });

      if (error) throw error;
      setHoursModifications(data || []);
    } catch (error) {
      console.error('Error loading hours modifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLinkedUser = async () => {
    try {
      const { data: users, error } = await supabase
        .from('auth_users_view')
        .select('id, email, raw_user_meta_data');

      if (error) throw error;

      const linkedUser = users.find(user => 
        user.raw_user_meta_data?.employee_id === employee.id
      );

      setLinkedUser(linkedUser || null);
    } catch (error) {
      console.error('Error loading linked user:', error);
    }
  };

  const handleAddModification = async () => {
    try {
      const { error } = await supabase
        .from('contract_hours_modifications')
        .insert({
          employee_id: employee.id,
          hours_change: newModification.hours_change,
          start_date: newModification.start_date,
          end_date: newModification.end_date || null,
          reason: newModification.reason || null
        });

      if (error) throw error;
      
      setShowAddModification(false);
      setNewModification({ hours_change: 0, start_date: '', end_date: '', reason: '' });
      loadHoursModifications();
    } catch (error) {
      console.error('Error adding modification:', error);
    }
  };

  const handleDeleteUser = async () => {
    if (!linkedUser) return;

    const confirmed = window.confirm(
      '¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.'
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      // First remove role assignments
      const { error: roleError } = await supabase
        .from('admin_roles')
        .delete()
        .eq('user_id', linkedUser.id);

      if (roleError) {
        console.error('Error removing role:', roleError);
      }

      // Then delete the user through the Edge Function
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { userId: linkedUser.id }
      });

      if (error) throw error;

      toast.success('Usuario eliminado correctamente');
      loadLinkedUser();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error al eliminar el usuario. Por favor, inténtalo de nuevo.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                {employee.full_name}
              </h2>
              {employee.employee_number && (
                <p className="text-sm text-gray-500 mt-1">
                  Nº Empleado: {employee.employee_number}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(employee)}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Edit2 className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Building className="h-4 w-4" />
                <span className="text-sm">Agrupación</span>
              </div>
              <p className="text-gray-900">{employee.group || '-'}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Briefcase className="h-4 w-4" />
                <span className="text-sm">Puesto</span>
              </div>
              <p className="text-gray-900">{employee.position || '-'}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Horas Contrato</span>
              </div>
              <p className="text-gray-900">{employee.contract_hours ? `${employee.contract_hours}h` : '-'}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Phone className="h-4 w-4" />
                <span className="text-sm">Teléfono</span>
              </div>
              <p className="text-gray-900">{employee.phone || '-'}</p>
            </div>
          </div>

          {/* User Account Section */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              Cuenta de Usuario
            </h3>
            {linkedUser ? (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Usuario vinculado: <span className="font-medium">{linkedUser.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowLinkUser(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                  >
                    <Link className="h-4 w-4" />
                    Cambiar usuario
                  </button>
                  <button
                    onClick={handleDeleteUser}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    {isDeleting ? 'Eliminando...' : 'Eliminar usuario'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Sin usuario asociado</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCreateUser(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                  >
                    <UserPlus className="h-4 w-4" />
                    Crear usuario
                  </button>
                  <button
                    onClick={() => setShowLinkUser(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                  >
                    <Link className="h-4 w-4" />
                    Vincular usuario
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hours Modifications */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900">Modificaciones de Horas</h3>
              <button
                onClick={() => setShowAddModification(true)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Añadir modificación
              </button>
            </div>

            {showAddModification && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cambio de Horas
                    </label>
                    <input
                      type="number"
                      value={newModification.hours_change}
                      onChange={(e) => setNewModification(prev => ({
                        ...prev,
                        hours_change: Number(e.target.value)
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      step="0.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha Inicio
                    </label>
                    <input
                      type="date"
                      value={newModification.start_date}
                      onChange={(e) => setNewModification(prev => ({
                        ...prev,
                        start_date: e.target.value
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha Fin (opcional)
                    </label>
                    <input
                      type="date"
                      value={newModification.end_date}
                      onChange={(e) => setNewModification(prev => ({
                        ...prev,
                        end_date: e.target.value
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Motivo (opcional)
                    </label>
                    <input
                      type="text"
                      value={newModification.reason}
                      onChange={(e) => setNewModification(prev => ({
                        ...prev,
                        reason: e.target.value
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setShowAddModification(false)}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddModification}
                    className="px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {hoursModifications.map((mod) => (
                <div key={mod.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Cambio de Horas</p>
                      <p className={`text-lg font-medium ${mod.hours_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {mod.hours_change > 0 ? '+' : ''}{mod.hours_change}h
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Período</p>
                      <p className="text-gray-900">
                        {formatDate(mod.start_date)} - {mod.end_date ? formatDate(mod.end_date) : 'Sin fecha fin'}
                      </p>
                    </div>
                    {mod.reason && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Motivo</p>
                        <p className="text-gray-900">{mod.reason}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showCreateUser && (
        <CreateUserModal
          employee={employee}
          onClose={() => setShowCreateUser(false)}
          onSuccess={() => {
            loadLinkedUser();
            setShowCreateUser(false);
          }}
        />
      )}

      {showLinkUser && (
        <LinkUserModal
          employee={employee}
          onClose={() => setShowLinkUser(false)}
          onSuccess={() => {
            loadLinkedUser();
            setShowLinkUser(false);
          }}
        />
      )}
    </div>
  );
}