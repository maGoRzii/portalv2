import React, { useState, useEffect } from 'react';
import { X, Link } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../../lib/supabase';
import { Employee } from '../../../types/hours';

interface LinkUserModalProps {
  employee: Employee;
  onClose: () => void;
  onSuccess: () => void;
}

export function LinkUserModal({ employee, onClose, onSuccess }: LinkUserModalProps) {
  const [users, setUsers] = useState<Array<{ id: string; email: string }>>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('auth_users_view')
        .select('id, email, raw_user_meta_data');

      if (error) throw error;

      // Filter out users that are already linked to employees
      const availableUsers = data.filter(user => 
        !user.raw_user_meta_data?.employee_id
      );

      setUsers(availableUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserId) {
      toast.error('Por favor, selecciona un usuario');
      return;
    }

    setSubmitting(true);

    try {
      // Update user metadata directly in the database
      const { error: updateError } = await supabase
        .rpc('update_user_metadata', {
          p_user_id: selectedUserId,
          p_metadata: {
            employee_id: employee.id,
            name: employee.full_name
          }
        });

      if (updateError) throw updateError;

      toast.success('Usuario vinculado correctamente');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error linking user:', error);
      toast.error(error.message || 'Error al vincular el usuario');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Link className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900">
                Vincular Usuario
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-500">
              Vinculando usuario a: <span className="font-medium text-gray-900">{employee.full_name}</span>
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Seleccionar Usuario
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar usuario</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Vinculando...' : 'Vincular Usuario'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}