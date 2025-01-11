import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TrainingGroup, TrainingEntry } from '../types/training';
import { toast } from 'react-hot-toast';
import { useAuth } from './useAuth';

interface UseTrainingGroupReturn {
  group: TrainingGroup | null;
  entries: TrainingEntry[];
  loading: boolean;
}

export function useTrainingGroup(slug: string, isAdmin: boolean = false): UseTrainingGroupReturn {
  const [group, setGroup] = useState<TrainingGroup | null>(null);
  const [entries, setEntries] = useState<TrainingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (slug) {
      loadGroup();
    }
  }, [slug, isAdmin]);

  const loadGroup = async () => {
    try {
      // Load group
      const { data: groupData, error: groupError } = await supabase
        .from('training_groups')
        .select('*')
        .eq('slug', slug)
        .single();

      if (groupError) throw groupError;
      setGroup(groupData);

      // Load entries - include unpublished if admin
      if (groupData) {
        const query = supabase
          .from('training_entries')
          .select('*')
          .eq('group_id', groupData.id)
          .order('created_at', { ascending: false });

        // Only filter by published if not admin
        if (!isAdmin) {
          query.eq('published', true);
        }

        const { data: entriesData, error: entriesError } = await query;

        if (entriesError) throw entriesError;
        setEntries(entriesData || []);
      }
    } catch (error) {
      console.error('Error loading training group:', error);
      toast.error('Error al cargar el grupo de formación');
    } finally {
      setLoading(false);
    }
  };

  return { group, entries, loading };
}