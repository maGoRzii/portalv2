import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

interface Permission {
  id: string;
  label: string;
}

const PERMISSIONS: Permission[] = [
  { id: 'holidays', label: 'Festivos' },
  { id: 'uniforms', label: 'Uniformes' },
  { id: 'lanzadera', label: 'Lanzadera' },
  { id: 'requests', label: 'Peticiones' },
  { id: 'tasks', label: 'Tareas' },
  { id: 'hours', label: 'Horas' },
  { id: 'employees', label: 'Empleados' },
  { id: 'training', label: 'Formación' },
  { id: 'roles', label: 'Roles' },
  { id: 'settings', label: 'Ajustes' }
];

interface RolePermissionsModalProps {
  role: string;
  onClose: () => void;
}

export function RolePermissionsModal({ role, onClose }: RolePermissionsModalProps) {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPermissions();
  }, [role]);

  const loadPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('permission')
        .eq('role', role);

      if (error) throw error;
      setPermissions(data.map(p => p.permission));
    } catch (error) {
      console.error('Error loading permissions:', error);
      toast.error('Error al cargar los permisos');
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = async (permission: string) => {
    setSaving(true);
    try {
      if (permissions.includes(permission)) {
        // Remove permission
        const { error } = await supabase
          .from('role_permissions')
          .delete()
          .eq('role', role)
          .eq('permission', permission);

        if (error) throw error;
        setPermissions(prev => prev.filter(p => p !== permission));
      } else {
        // Add permission
        const { error } = await supabase
          .from('role_permissions')
          .insert({ role, permission });

        if (error) throw error;
        setPermissions(prev => [...prev, permission]);
      }
      toast.success('Permisos actualizados');
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.error('Error al actualizar los permisos');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-medium">
            Permisos del rol: <span className="font-semibold">{role}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {PERMISSIONS.map((permission) => (
              <label
                key={permission.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <span className="text-gray-700">{permission.label}</span>
                <div 
                  className={`w-6 h-6 rounded flex items-center justify-center transition-colors
                    ${permissions.includes(permission.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200'
                    }`}
                  onClick={() => !saving && togglePermission(permission.id)}
                >
                  {permissions.includes(permission.id) && (
                    <Check className="h-4 w-4" />
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}