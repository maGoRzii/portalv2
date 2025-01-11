import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TrainingGroup } from '../types/training';
import { toast } from 'react-hot-toast';

export function useTrainingGroups() {
  const [groups, setGroups] = useState<TrainingGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('training_groups')
        .select('*')
        .order('name');

      if (error) throw error;
      setGroups(data || []);
    } catch (error) {
      console.error('Error loading training groups:', error);
      toast.error('Error al cargar los grupos de formación');
    } finally {
      setLoading(false);
    }
  };

  return { groups, loading };
}