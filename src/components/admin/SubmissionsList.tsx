import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { SubmissionCard } from './SubmissionCard';
import { Download, FileText } from 'lucide-react';
import { exportToCSV } from '../../utils/export';
import { DateFilter } from './DateFilter';

export function SubmissionsList() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const navigate = useNavigate();

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

  const filteredSubmissions = selectedDate
    ? submissions.filter(submission =>
        submission.holiday_shifts.some(shift => shift.holiday_date === selectedDate)
      )
    : submissions;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Solicitudes ({filteredSubmissions.length})
          </h2>
          <DateFilter
            selectedDate={selectedDate}
            onChange={setSelectedDate}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/admin/print-summary${selectedDate ? `?date=${selectedDate}` : ''}`)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium 
                     rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <FileText className="h-4 w-4 mr-2" />
            Imprimir Resumen
          </button>
          <button
            onClick={() => exportToCSV(filteredSubmissions, 'solicitudes-turnos')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium 
                     rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSubmissions.map((submission) => (
          <SubmissionCard
            key={submission.id}
            submission={submission}
            onPrint={() => navigate(`/admin/print/${submission.id}`)}
          />
        ))}
      </div>
    </div>
  );
}