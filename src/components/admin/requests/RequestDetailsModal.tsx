import React from 'react';
import { X, FileText, Download, CheckCircle, Archive, ArchiveRestore } from 'lucide-react';
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
  onArchive: (id: string, archived: boolean) => void;
}

export function RequestDetailsModal({ 
  request, 
  onClose, 
  onDelete,
  onStatusChange,
  onArchive
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

  const handleArchive = async () => {
    await onArchive(request.id, !request.archived);
    onClose();
  };

  const handleStatusChange = async () => {
    await onStatusChange(request.id, request.status === 'pending' ? 'done' : 'pending');
    onClose();
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
          {/* Header */}
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
                onClick={handleArchive}
                className="inline-flex items-center px-3 py-2 border border-gray-300 
                         rounded-md shadow-sm text-sm font-medium text-gray-700 
                         bg-white hover:bg-gray-50"
              >
                {request.archived ? (
                  <>
                    <ArchiveRestore className="h-4 w-4 mr-2" />
                    Desarchivar
                  </>
                ) : (
                  <>
                    <Archive className="h-4 w-4 mr-2" />
                    Archivar
                  </>
                )}
              </button>
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

          {/* Clock Card Option */}
          {request.type === 'clock_card' && request.clock_card_option && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Opción seleccionada:</h4>
              <p className="text-sm text-gray-600">
                {getClockCardOptionLabel()}
              </p>
            </div>
          )}

          {/* Message */}
          {request.message && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Mensaje:</h4>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-600 whitespace-pre-wrap">{request.message}</p>
              </div>
            </div>
          )}

          {/* Attachments */}
          {request.attachments && request.attachments.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Archivos adjuntos:
              </h4>
              <div className="grid gap-2">
                {request.attachments.map((path, index) => {
                  const fileName = path.split('/').pop() || 'archivo';
                  return (
                    <button
                      key={index}
                      onClick={() => handleDownload(path)}
                      className="flex items-center justify-between w-full px-4 py-2 text-sm
                               text-gray-700 bg-white rounded-lg border border-gray-200
                               hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                        <span className="truncate">{fileName}</span>
                      </div>
                      <Download className="h-4 w-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}