import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserRole } from '../types/role';
import { useAuth } from './useAuth';

export function useRole() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadRoleAndPermissions();
    } else {
      setRole(null);
      setPermissions([]);
      setLoading(false);
    }
  }, [user]);

  const loadRoleAndPermissions = async () => {
    try {
      // Load role
      const { data: roleData, error: roleError } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', user!.id)
        .single();

      if (roleError && roleError.code !== 'PGRST116') throw roleError;
      
      const userRole = roleData?.role || null;
      setRole(userRole);

      // Load permissions if role exists
      if (userRole) {
        const { data: permData, error: permError } = await supabase
          .from('role_permissions')
          .select('permission')
          .eq('role', userRole);

        if (permError) throw permError;
        setPermissions(permData.map(p => p.permission));
      }
    } catch (error) {
      console.error('Error loading role and permissions:', error);
      setRole(null);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (section: string): boolean => {
    if (!role) return false;
    if (role === 'developer') return true;
    return permissions.includes(section);
  };

  return { role, loading, hasPermission };
}