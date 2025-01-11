import React, { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { RequestsList } from './RequestsList';
import { RequestTypeFilter } from './RequestTypeFilter';
import { Request, RequestStatus } from '../../../types/request';

export function Requests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('');

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

  const handleStatusChange = (id: string, status: RequestStatus) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status } : req
    ));
  };

  const filteredRequests = selectedType
    ? requests.filter(request => request.type === selectedType)
    : requests;

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
            Peticiones / Justificantes ({filteredRequests.length})
          </h2>
        </div>
        <RequestTypeFilter
          value={selectedType}
          onChange={setSelectedType}
        />
      </div>
      
      <RequestsList 
        requests={filteredRequests} 
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}