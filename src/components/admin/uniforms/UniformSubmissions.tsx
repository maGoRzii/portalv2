import React, { useState, useEffect } from 'react';
import { Shirt, Settings } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { UniformSubmissionsList } from './UniformSubmissionsList';
import { UniformSizesManagement } from './UniformSizesManagement';

export function UniformSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSizesManagement, setShowSizesManagement] = useState(false);

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

  if (showSizesManagement) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <UniformSizesManagement />
          <button
            onClick={() => setShowSizesManagement(false)}
            className="text-blue-600 hover:text-blue-800"
          >
            Volver a solicitudes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shirt className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Solicitudes de Uniformes ({submissions.length})
          </h2>
        </div>
        <button
          onClick={() => setShowSizesManagement(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Settings className="h-4 w-4" />
          Gestionar Tallas
        </button>
      </div>
      
      <UniformSubmissionsList submissions={submissions} onDelete={handleDelete} />
    </div>
  );
}