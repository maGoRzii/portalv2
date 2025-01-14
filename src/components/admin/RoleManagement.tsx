import React, { useState, useEffect } from 'react';
import { Shield, Settings, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { UserRole } from '../../types/role';
import { RolePermissionsModal } from './RolePermissionsModal';
import { NewRoleModal } from './NewRoleModal';

const ROLE_LABELS = {
  developer: 'Desarrollador',
  admin: 'Administrador',
  administrative: 'Administrativo',
  manager: 'Manager'
};

export function RoleManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [roles, setRoles] = useState<Record<string, string>>(ROLE_LABELS);

  useEffect(() => {
    loadUsers();
    loadCustomRoles();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users_view')
        .select('*');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const loadCustomRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_roles')
        .select('*');

      if (error) throw error;

      const customRoles = (data || []).reduce((acc, role) => ({
        ...acc,
        [role.id]: role.name
      }), {});

      setRoles({ ...ROLE_LABELS, ...customRoles });
    } catch (error) {
      console.error('Error loading custom roles:', error);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole | '') => {
    try {
      if (newRole) {
        // Assign role
        const { error } = await supabase
          .from('admin_roles')
          .upsert({
            user_id: userId,
            role: newRole
          }, {
            onConflict: 'user_id'
          });

        if (error) throw error;
      } else {
        // Remove role
        const { error } = await supabase
          .from('admin_roles')
          .delete()
          .eq('user_id', userId);

        if (error) throw error;
      }

      toast.success('Rol actualizado correctamente');
      await loadUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Error al actualizar el rol');
    }
  };

  const handleRoleCreated = (roleId: string, roleName: string) => {
    setRoles(prev => ({ ...prev, [roleId]: roleName }));
    setIsAddingRole(false);
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
        <Shield className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Gestión de Roles
        </h2>
      </div>

      {/* Role List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Roles del Sistema</h3>
            <p className="mt-1 text-sm text-gray-500">
              Haz click en un rol para gestionar sus permisos
            </p>
          </div>
          <button
            onClick={() => setIsAddingRole(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent 
                     rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 
                     hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Rol
          </button>
        </div>
        <div className="border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            {Object.entries(roles).map(([roleId, label]) => (
              <button
                key={roleId}
                onClick={() => setSelectedRole(roleId)}
                className="p-4 rounded-lg border border-gray-200 hover:border-blue-500 
                         hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{label}</span>
                  <Settings className="h-5 w-5 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.raw_user_meta_data?.name || user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role || ''}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole | '')}
                      className="text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      disabled={!user.can_manage}
                    >
                      <option value="">Sin rol</option>
                      {Object.entries(roles).map(([roleId, label]) => (
                        <option key={roleId} value={roleId}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRole && (
        <RolePermissionsModal
          role={selectedRole}
          roleName={roles[selectedRole]}
          onClose={() => setSelectedRole(null)}
        />
      )}

      {isAddingRole && (
        <NewRoleModal
          onClose={() => setIsAddingRole(false)}
          onRoleCreated={handleRoleCreated}
        />
      )}
    </div>
  );
}