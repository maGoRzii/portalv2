import React from 'react';
import { formatDate } from '../../../utils/date';
import { TrainingEntry } from '../../../types/training';
import { DeleteButton } from '../DeleteButton';

interface TrainingEntryTableProps {
  entries: TrainingEntry[];
  onDelete: (id: string) => void;
  onEdit: (entry: TrainingEntry) => void;
}

export function TrainingEntryTable({ entries, onDelete, onEdit }: TrainingEntryTableProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="hidden sm:block"> {/* Desktop view */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {entry.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full
                    ${entry.published 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {entry.published ? 'Publicado' : 'Borrador'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(entry.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(entry)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </button>
                    <DeleteButton onDelete={() => onDelete(entry.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="sm:hidden">
        <ul className="divide-y divide-gray-200">
          {entries.map((entry) => (
            <li key={entry.id} className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="text-sm font-medium text-gray-900">
                    {entry.title}
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full
                    ${entry.published 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {entry.published ? 'Publicado' : 'Borrador'}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(entry.created_at)}
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => onEdit(entry)}
                    className="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    Editar
                  </button>
                  <DeleteButton onDelete={() => onDelete(entry.id)} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}