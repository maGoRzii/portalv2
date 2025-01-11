import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { TrainingEntryTable } from '../../components/admin/training/TrainingEntryTable';
import { TrainingEntryForm } from '../../components/admin/training/TrainingEntryForm';
import { useTrainingGroup } from '../../hooks/useTrainingGroup';
import { useTrainingAdmin } from '../../hooks/useTrainingAdmin';
import { TrainingEntry } from '../../types/training';

export function TrainingEntriesPage() {
  const { slug } = useParams<{ slug: string }>();
  const { group, entries, loading } = useTrainingGroup(slug || '', true); // Pass true for admin view
  const [isAdding, setIsAdding] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TrainingEntry | null>(null);
  const admin = useTrainingAdmin(group?.id || '');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-12 text-gray-500">
        Grupo no encontrado
      </div>
    );
  }

  const handleCreate = async (data: any) => {
    const success = await admin.createEntry(data);
    if (success) {
      setIsAdding(false);
      window.location.reload();
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingEntry) return;
    const success = await admin.updateEntry(editingEntry.id, data);
    if (success) {
      setEditingEntry(null);
      window.location.reload();
    }
  };

  const handleDelete = async (id: string) => {
    const success = await admin.deleteEntry(id);
    if (success) {
      window.location.reload();
    }
  };

  if (isAdding || editingEntry) {
    return (
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {isAdding ? 'Nueva Entrada' : 'Editar Entrada'}
        </h2>
        <TrainingEntryForm
          initialData={editingEntry || undefined}
          onSubmit={isAdding ? handleCreate : handleUpdate}
          onCancel={() => {
            setIsAdding(false);
            setEditingEntry(null);
          }}
          loading={admin.loading}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {group.name} - Entradas
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent
                   rounded-md shadow-sm text-sm font-medium text-white w-full sm:w-auto
                   bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2
                   focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Entrada
        </button>
      </div>

      <TrainingEntryTable
        entries={entries}
        onDelete={handleDelete}
        onEdit={setEditingEntry}
      />
    </div>
  );
}