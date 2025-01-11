import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { ScheduleRequestsList } from './ScheduleRequestsList';
import { exportScheduleToCSV } from '../../../utils/export';

export function ScheduleRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('schedule_changes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error loading schedule changes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setRequests(requests.filter(req => req.id !== id));
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
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Solicitudes de Cambio de Horario ({requests.length})
          </h2>
        </div>
        <button
          onClick={() => exportScheduleToCSV(requests, 'cambios-horario')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm 
                   font-medium rounded-lg text-white bg-green-600 hover:bg-green-700"
        >
          Exportar CSV
        </button>
      </div>
      
      <ScheduleRequestsList requests={requests} onDelete={handleDelete} />
    </div>
  );
}