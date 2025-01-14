import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Default feature flag values
const DEFAULT_FLAGS = {
  holidays_enabled: true,
  uniforms_enabled: true,
  lanzadera_enabled: true,
  requests_enabled: true,
  training_enabled: true,
  schedule_enabled: true
};

export function useFeatureFlags() {
  const [flags, setFlags] = useState(DEFAULT_FLAGS);
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

      // Merge fetched flags with defaults
      const flagsMap = (data || []).reduce((acc, { name, enabled }) => ({
        ...acc,
        [name]: enabled
      }), DEFAULT_FLAGS);

      setFlags(flagsMap);
    } catch (error) {
      console.error('Error loading feature flags:', error);
      // Keep using default values in case of error
    } finally {
      setLoading(false);
    }
  };

  return { flags, loading };
}