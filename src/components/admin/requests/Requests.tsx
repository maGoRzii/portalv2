import React, { useEffect, useState } from 'react';
import { FileText, Archive as ArchiveIcon } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { RequestsList } from './RequestsList';
import { RequestTypeFilter } from './RequestTypeFilter';
import { Request, RequestStatus } from '../../../types/request';
import { toast } from 'react-hot-toast';

export function Requests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setRequests(requests.filter(req => req.id !== id));
  };

  const handleStatusChange = async (id: string, status: RequestStatus) => {
    try {
      const { error } = await supabase
        .from('requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setRequests(requests.map(req => 
        req.id === id ? { ...req, status } : req
      ));

      toast.success(status === 'done' ? 'Petición marcada como hecha' : 'Petición marcada como pendiente');
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error('Error al actualizar el estado de la petición');
    }
  };

  const handleArchive = async (id: string, archived: boolean) => {
    try {
      const { error } = await supabase
        .from('requests')
        .update({ archived })
        .eq('id', id);

      if (error) throw error;

      setRequests(requests.map(req =>
        req.id === id ? { ...req, archived } : req
      ));

      toast.success(archived ? 'Petición archivada' : 'Petición desarchivada');
    } catch (error) {
      console.error('Error archiving request:', error);
      toast.error('Error al archivar la petición');
    }
  };

  const filteredRequests = requests.filter(request => 
    (selectedType ? request.type === selectedType : true) &&
    request.archived === showArchived
  );

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
          <FileText className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            {showArchived ? 'Peticiones Archivadas' : 'Peticiones'} ({filteredRequests.length})
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium
                     transition-colors duration-200 ${
                       showArchived
                         ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                         : 'bg-gray-700 text-white hover:bg-gray-800'
                     }`}
          >
            <ArchiveIcon className="h-4 w-4 mr-2" />
            {showArchived ? 'Ver Activas' : 'Ver Archivadas'}
          </button>
          <RequestTypeFilter
            value={selectedType}
            onChange={setSelectedType}
          />
        </div>
      </div>
      
      <RequestsList 
        requests={filteredRequests} 
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        onArchive={handleArchive}
        showArchived={showArchived}
      />
    </div>
  );
}