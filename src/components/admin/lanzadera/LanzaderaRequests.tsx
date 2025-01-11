import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../hooks/useAuth';
import { formatDateTime } from '../../../utils/date';
import { Check, X, Truck, LogIn, LogOut, MapPin } from 'lucide-react';

interface LanzaderaRecord {
  id: string;
  driver_name: string;
  type: 'check_in' | 'check_out';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  latitude: number | null;
  longitude: number | null;
  location_error: string | null;
}

export function LanzaderaRequests() {
  const [records, setRecords] = useState<LanzaderaRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('lanzadera_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error loading records:', error);
      toast.error('Error al cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('lanzadera_records')
        .update({
          status,
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      toast.success(status === 'approved' ? 'Solicitud aprobada' : 'Solicitud rechazada');
      loadRecords();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al procesar la solicitud');
    }
  };

  const getLocationLink = (record: LanzaderaRecord) => {
    if (record.location_error) return null;
    if (!record.latitude || !record.longitude) return null;
    return `https://www.google.com/maps?q=${record.latitude},${record.longitude}`;
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
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Truck className="h-6 w-6 text-blue-600" />
          Solicitudes de Fichaje ({records.length})
        </h2>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {records.map((record) => (
            <li key={record.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {record.type === 'check_in' ? (
                      <LogIn className="h-5 w-5 text-green-600" />
                    ) : (
                      <LogOut className="h-5 w-5 text-red-600" />
                    )}
                    <h3 className="text-lg font-medium text-gray-900">
                      {record.driver_name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDateTime(record.created_at)}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    {record.location_error ? (
                      <span className="text-sm text-red-600">
                        Error de ubicación: {record.location_error}
                      </span>
                    ) : getLocationLink(record) ? (
                      <a
                        href={getLocationLink(record)!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Ver ubicación
                      </a>
                    ) : (
                      <span className="text-sm text-gray-500">
                        Ubicación no disponible
                      </span>
                    )}
                  </div>
                </div>

                {record.status === 'pending' ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(record.id, 'approved')}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm 
                               font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleAction(record.id, 'rejected')}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm 
                               font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Rechazar
                    </button>
                  </div>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium
                    ${record.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'}`}
                  >
                    {record.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}