import React, { useState } from 'react';
import { formatDate } from '../../../utils/date';
import { RequestTypeBadge } from './RequestTypeBadge';
import { RequestStatusBadge } from './RequestStatusBadge';
import { RequestDetailsModal } from './RequestDetailsModal';
import { Request } from '../../../types/request';

interface RequestsListProps {
  requests: Request[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: 'pending' | 'done') => void;
}

export function RequestsList({ requests, onDelete, onStatusChange }: RequestsListProps) {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="hidden md:block"> {/* Desktop view */}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile view */}
        <div className="md:hidden">
          <ul className="divide-y divide-gray-200">
            {requests.map((request) => (
              <li
                key={request.id}
                onClick={() => setSelectedRequest(request)}
                className="p-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="text-sm font-medium text-gray-900">
                      {request.first_name} {request.last_name}
                    </div>
                    <RequestStatusBadge status={request.status} />
                  </div>
                  <div className="flex flex-wrap gap-2 items-center text-sm text-gray-500">
                    <RequestTypeBadge type={request.type} />
                    <span>{formatDate(request.created_at)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      )}
    </>
  );
}