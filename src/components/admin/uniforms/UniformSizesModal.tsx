import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';

interface UniformSizesModalProps {
  categoryId: string;
  itemId: string;
  onClose: () => void;
}

interface UniformSize {
  id: string;
  size_id: string;
  size_label: string;
}

export function UniformSizesModal({ categoryId, itemId, onClose }: UniformSizesModalProps) {
  const [sizes, setSizes] = useState<UniformSize[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newSize, setNewSize] = useState({ id: '', label: '' });

  useEffect(() => {
    loadSizes();
  }, [categoryId, itemId]);

  const loadSizes = async () => {
    try {
      console.log(`Cargando tallas para categoría: ${categoryId} item: ${itemId}`);
      
      const { data, error } = await supabase
        .from('uniform_sizes')
        .select('id, size_id, size_label')
        .eq('category_id', categoryId)
        .eq('item_id', itemId)
        .order('size_label');

      if (error) throw error;

      console.log('Tallas cargadas:', data);
      setSizes(data || []);
    } catch (err) {
      console.error('Error loading sizes:', err);
      toast.error('Error al cargar las tallas');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSize = async () => {
    if (!newSize.id.trim() || !newSize.label.trim()) {
      toast.error('Por favor, completa todos los campos');
      return;
    }

    try {
      console.log('Añadiendo talla:', {
        category_id: categoryId,
        item_id: itemId,
        size_id: newSize.id,
        size_label: newSize.label
      });

      const { error } = await supabase
        .from('uniform_sizes')
        .insert({
          category_id: categoryId,
          item_id: itemId,
          size_id: newSize.id,
          size_label: newSize.label
        });

      if (error) {
        if (error.code === '23505') {
          toast.error('Esta talla ya existe');
        } else {
          throw error;
        }
        return;
      }

      await loadSizes();
      setNewSize({ id: '', label: '' });
      setIsAdding(false);
      toast.success('Talla añadida correctamente');
    } catch (err) {
      console.error('Error adding size:', err);
      toast.error('Error al añadir la talla');
    }
  };

  const handleRemoveSize = async (sizeId: string) => {
    try {
      const { error } = await supabase
        .from('uniform_sizes')
        .delete()
        .eq('category_id', categoryId)
        .eq('item_id', itemId)
        .eq('size_id', sizeId);

      if (error) throw error;

      await loadSizes();
      toast.success('Talla eliminada correctamente');
    } catch (err) {
      console.error('Error removing size:', err);
      toast.error('Error al eliminar la talla');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Gestionar Tallas
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Lista de tallas */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {sizes.map((size) => (
                    <div
                      key={size.id}
                      className="flex items-center justify-between bg-white p-2 rounded border border-gray-200"
                    >
                      <div>
                        <span className="text-sm font-medium text-gray-900">{size.size_id}</span>
                        <span className="text-sm text-gray-500 ml-2">({size.size_label})</span>
                      </div>
                      <button
                        onClick={() => handleRemoveSize(size.size_id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formulario para añadir talla */}
              {isAdding ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        ID de Talla
                      </label>
                      <input
                        type="text"
                        value={newSize.id}
                        onChange={(e) => setNewSize({ ...newSize, id: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Ej: XL"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Etiqueta
                      </label>
                      <input
                        type="text"
                        value={newSize.label}
                        onChange={(e) => setNewSize({ ...newSize, label: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Ej: Talla XL"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={() => setIsAdding(false)}
                      className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleAddSize}
                      className="px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Añadir
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAdding(true)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Añadir nueva talla
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}