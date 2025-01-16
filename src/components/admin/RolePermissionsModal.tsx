import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { RolePermissionsSelector } from './RolePermissionsSelector';

interface RolePermissionsModalProps {
  role: string;
  roleName: string;
  onClose: () => void;
}

export function RolePermissionsModal({ role, roleName, onClose }: RolePermissionsModalProps) {
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
            Permisos del rol: <span className="font-semibold">{roleName}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <RolePermissionsSelector
            selectedPermissions={permissions}
            onChange={togglePermission}
          />
        </div>
      </div>
    </div>
  );
}