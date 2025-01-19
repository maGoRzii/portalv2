import React, { useState } from 'react';
import { Settings, Plus, X } from 'lucide-react';
import { UNIFORM_DATA, UNIFORM_SIZES } from '../../../data/uniforms';
import { toast } from 'react-hot-toast';

export function UniformSizesManagement() {
  const [selectedItem, setSelectedItem] = useState<{
    categoryId: string;
    itemId: string;
  } | null>(null);

  const handleSizeChange = (itemId: string, sizes: typeof UNIFORM_SIZES[keyof typeof UNIFORM_SIZES]) => {
    // Aquí iría la lógica para modificar el archivo uniforms.ts
    // Como no podemos modificar archivos directamente, mostramos un mensaje
    toast.info('Para modificar las tallas, actualiza el archivo src/data/uniforms.ts');
    
    // Mostramos los cambios que se deberían hacer
    console.log('Cambios a realizar en uniforms.ts:', {
      itemId,
      newSizes: sizes
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Gestión de Tallas
          </h2>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {UNIFORM_DATA.map((category) => (
          <div key={category.id} className="border-b border-gray-200">
            <div className="bg-gray-50 px-6 py-3">
              <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {category.items.map((item) => {
                const availableSizes = UNIFORM_SIZES[item.id as keyof typeof UNIFORM_SIZES] || [];
                return (
                  <div
                    key={item.id}
                    className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedItem({ categoryId: category.id, itemId: item.id })}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {availableSizes.length} tallas disponibles
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {availableSizes.map((size) => (
                          <span
                            key={size.id}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {size.id}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Gestionar Tallas
                </h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Las tallas se gestionan directamente en el código fuente. Para modificarlas, actualiza el archivo:
                    </p>
                    <p className="text-sm font-mono mt-2 text-yellow-800">
                      src/data/uniforms.ts
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Tallas actuales:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {UNIFORM_SIZES[selectedItem.itemId as keyof typeof UNIFORM_SIZES]?.map((size) => (
                    <div
                      key={size.id}
                      className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200"
                    >
                      <span className="text-sm font-medium text-gray-900">{size.id}</span>
                      <span className="text-sm text-gray-500">({size.label})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}