import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useFeatureFlags() {
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFlags();
  }, []);

  const loadFlags = async () => {
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('name, enabled');

      if (error) throw error;

      const flagsMap = (data || []).reduce((acc, { name, enabled }) => ({
        ...acc,
        [name]: enabled
      }), {});

      setFlags(flagsMap);
    } catch (error) {
      console.error('Error loading feature flags:', error);
    } finally {
      setLoading(false);
    }
  };

  return { flags, loading };
}