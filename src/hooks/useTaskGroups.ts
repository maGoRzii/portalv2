import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TaskGroup } from '../types/taskGroup';
import { toast } from 'react-hot-toast';

export function useTaskGroups() {
  const [groups, setGroups] = useState<TaskGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<string>('');

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('task_groups')
        .select('*')
        .order('name');

      if (error) throw error;
      setGroups(data || []);
    } catch (error) {
      console.error('Error loading task groups:', error);
      toast.error('Error al cargar las agrupaciones');
    } finally {
      setLoading(false);
    }
  };

  return {
    groups,
    loading,
    selectedGroup,
    setSelectedGroup
  };
}