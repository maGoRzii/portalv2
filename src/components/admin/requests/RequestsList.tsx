import React, { useState } from 'react';
import { formatDate } from '../../../utils/date';
import { RequestTypeBadge } from './RequestTypeBadge';
import { RequestStatusBadge } from './RequestStatusBadge';
import { RequestDetailsModal } from './RequestDetailsModal';
import { Request } from '../../../types/request';
import { Archive, ArchiveRestore } from 'lucide-react';

interface RequestsListProps {
  requests: Request[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: 'pending' | 'done') => void;
  onArchive: (id: string, archived: boolean) => void;
  showArchived?: boolean;
}

export function RequestsList({ 
  requests, 
  onDelete, 
  onStatusChange,
  onArchive,
  showArchived = false
}: RequestsListProps) {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto"> {/* Add horizontal scroll */}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Mensaje
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {request.first_name} {request.last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(request.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RequestTypeBadge type={request.type} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RequestStatusBadge status={request.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-md truncate">
                      {request.message}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onArchive(request.id, !request.archived);
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title={request.archived ? 'Desarchivar' : 'Archivar'}
                    >
                      {request.archived ? (
                        <ArchiveRestore className="h-5 w-5" />
                      ) : (
                        <Archive className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onArchive={onArchive}
        />
      )}
    </>
  );
}