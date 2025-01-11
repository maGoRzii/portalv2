import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TrainingEntry } from '../types/training';
import { toast } from 'react-hot-toast';

export function useTrainingEntries(groupId: string) {
  const [entries, setEntries] = useState<TrainingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (groupId) {
      loadEntries();
    }
  }, [groupId]);

  const loadEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('training_entries')
        .select('*')
        .eq('group_id', groupId)
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error loading training entries:', error);
      toast.error('Error al cargar las entradas de formación');
    } finally {
      setLoading(false);
    }
  };

  return { entries, loading };
}