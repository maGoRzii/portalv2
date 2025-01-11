import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TrainingEntry, TrainingMedia } from '../types/training';
import { toast } from 'react-hot-toast';

interface UseTrainingEntryReturn {
  entry: TrainingEntry | null;
  media: TrainingMedia[];
  loading: boolean;
}

export function useTrainingEntry(groupSlug: string, entrySlug: string): UseTrainingEntryReturn {
  const [entry, setEntry] = useState<TrainingEntry | null>(null);
  const [media, setMedia] = useState<TrainingMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (groupSlug && entrySlug) {
      loadEntry();
    }
  }, [groupSlug, entrySlug]);

  const loadEntry = async () => {
    try {
      // Load entry
      const { data: entries, error: entryError } = await supabase
        .from('training_entries')
        .select('*, training_groups!inner(slug)')
        .eq('training_groups.slug', groupSlug)
        .eq('slug', entrySlug)
        .single();

      if (entryError) throw entryError;
      setEntry(entries);

      // Load media
      if (entries) {
        const { data: mediaData, error: mediaError } = await supabase
          .from('training_media')
          .select('*')
          .eq('entry_id', entries.id)
          .order('created_at');

        if (mediaError) throw mediaError;
        setMedia(mediaData || []);
      }
    } catch (error) {
      console.error('Error loading training entry:', error);
      toast.error('Error al cargar la entrada de formación');
    } finally {
      setLoading(false);
    }
  };

  return { entry, media, loading };
}