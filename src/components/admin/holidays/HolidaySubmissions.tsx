import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { HolidaySubmissionsList } from './HolidaySubmissionsList';
import { HolidayDateExport } from './HolidayDateExport';
import { HolidayManagement } from './HolidayManagement';

export function HolidaySubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showManagement, setShowManagement] = useState(false);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('holiday_submissions')
        .select(`
          *,
          holiday_shifts (
            holiday_date,
            compensation_type
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error loading submissions:', error);
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Solicitudes de Festivos ({submissions.length})
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowManagement(!showManagement)}
            className="text-blue-600 hover:text-blue-800"
          >
            {showManagement ? 'Ver Solicitudes' : 'Gestionar Festivos'}
          </button>
          <HolidayDateExport />
        </div>
      </div>
      
      {showManagement ? (
        <HolidayManagement onUpdate={loadSubmissions} />
      ) : (
        <HolidaySubmissionsList 
          submissions={submissions} 
          onDelete={handleDelete} 
        />
      )}
    </div>
  );
}