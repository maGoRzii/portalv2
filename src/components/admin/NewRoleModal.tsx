import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { RolePermissionsSelector } from './RolePermissionsSelector';

interface NewRoleModalProps {
  onClose: () => void;
  onRoleCreated: (roleId: string, roleName: string) => void;
}

export function NewRoleModal({ onClose, onRoleCreated }: NewRoleModalProps) {
  const [name, setName] = useState('');
  const [permissions, setPermissions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Por favor, introduce un nombre para el rol');
      return;
    }

    setSaving(true);
    try {
      // Create custom role
      const { data: roleData, error: roleError } = await supabase
        .from('custom_roles')
        .insert({ name: name.trim() })
        .select()
        .single();

      if (roleError) throw roleError;

      // Add permissions
      if (permissions.length > 0) {
        const { error: permError } = await supabase
          .from('role_permissions')
          .insert(
            permissions.map(permission => ({
              role: roleData.id,
              permission
            }))
          );

        if (permError) throw permError;
      }

      toast.success('Rol creado correctamente');
      onRoleCreated(roleData.id, roleData.name);
    } catch (error) {
      console.error('Error creating role:', error);
      toast.error('Error al crear el rol');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-medium text-gray-900">Nuevo Rol</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre del Rol
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                         focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ej: Supervisor"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permisos
              </label>
              <RolePermissionsSelector
                selectedPermissions={permissions}
                onChange={setPermissions}
              />
            </div>
          </div>

          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border 
                         border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border 
                         border-transparent rounded-md shadow-sm hover:bg-blue-700 
                         disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Crear Rol'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}