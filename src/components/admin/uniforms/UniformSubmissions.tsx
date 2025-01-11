import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { UniformSubmissionsList } from './UniformSubmissionsList';

export function UniformSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('uniform_requests')
        .select(`
          *,
          uniform_items (
            item_id,
            size
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error loading uniform submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setSubmissions(submissions.filter(sub => sub.id !== id));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Solicitudes de Uniformes ({submissions.length})
      </h2>
      
      <UniformSubmissionsList submissions={submissions} onDelete={handleDelete} />
    </div>
  );
}