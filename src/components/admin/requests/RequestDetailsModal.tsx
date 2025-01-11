import React from 'react';
import { X, FileText, Download, CheckCircle } from 'lucide-react';
import { formatDate } from '../../../utils/date';
import { RequestTypeBadge } from './RequestTypeBadge';
import { RequestStatusBadge } from './RequestStatusBadge';
import { DeleteButton } from '../DeleteButton';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Request, RequestStatus, CLOCK_CARD_OPTIONS } from '../../../types/request';

interface RequestDetailsModalProps {
  request: Request;
  onClose: () => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: RequestStatus) => void;
}

export function RequestDetailsModal({ 
  request, 
  onClose, 
  onDelete,
  onStatusChange 
}: RequestDetailsModalProps) {
  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('requests')
        .delete()
        .eq('id', request.id);

      if (error) throw error;
      onDelete(request.id);
      onClose();
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Error al eliminar la petición');
    }
  };

  const handleStatusChange = async () => {
    const newStatus: RequestStatus = request.status === 'pending' ? 'done' : 'pending';
    try {
      const { error } = await supabase
        .from('requests')
        .update({ status: newStatus })
        .eq('id', request.id);

      if (error) throw error;
      onStatusChange(request.id, newStatus);
      toast.success(newStatus === 'done' ? 'Petición marcada como hecha' : 'Petición marcada como pendiente');
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error('Error al actualizar el estado de la petición');
    }
  };

  const handleDownload = async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('attachments')
        .download(path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = path.split('/').pop() || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Error al descargar el archivo');
    }
  };

  const getClockCardOptionLabel = () => {
    if (!request.clock_card_option) return null;
    return CLOCK_CARD_OPTIONS.find(opt => opt.value === request.clock_card_option)?.label;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {request.first_name} {request.last_name}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <p className="text-sm text-gray-500">
                  {formatDate(request.created_at)}
                </p>
                <RequestTypeBadge type={request.type} />
                <RequestStatusBadge status={request.status} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleStatusChange}
                className={`inline-flex items-center px-3 py-2 border border-transparent text-sm 
                         font-medium rounded-md text-white transition-colors duration-200
                         ${request.status === 'pending'
                           ? 'bg-green-600 hover:bg-green-700'
                           : 'bg-yellow-600 hover:bg-yellow-700'
                         }`}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {request.status === 'pending' ? 'Hecho' : 'Pendiente'}
              </button>
              <DeleteButton onDelete={handleDelete} />
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {request.type === 'clock_card' && request.clock_card_option && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Opción seleccionada:</h4>
              <p className="text-sm text-gray-600">
                {getClockCardOptionLabel()}
              </p>
            </div>
          )}

          {request.message && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Mensaje:</h4>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {request.message}
              </p>
            </div>
          )}

          {request.attachments?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Archivos adjuntos:
              </h4>
              <div className="flex flex-wrap gap-2">
                {request.attachments.map((path, index) => (
                  <button
                    key={index}
                    onClick={() => handleDownload(path)}
                    className="inline-flex items-center px-3 py-1 rounded-md text-sm
                             text-gray-700 bg-gray-100 hover:bg-gray-200"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    <span className="truncate max-w-[150px]">
                      {path.split('/').pop()}
                    </span>
                    <Download className="h-4 w-4 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}