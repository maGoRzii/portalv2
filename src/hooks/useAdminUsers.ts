import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AdminUser } from '../types/task';
import { toast } from 'react-hot-toast';

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('email');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading admin users:', error);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  return { users, loading };
}