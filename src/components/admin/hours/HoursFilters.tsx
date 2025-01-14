import React, { useState } from 'react';
import { Filter, Search, X } from 'lucide-react';

interface HoursFiltersProps {
  groups: string[];
  searchTerm: string;
  selectedGroup: string;
  balanceFilter: 'all' | 'positive' | 'negative';
  pendingHolidaysOnly: boolean;
  onSearchChange: (value: string) => void;
  onGroupChange: (value: string) => void;
  onBalanceFilterChange: (value: 'all' | 'positive' | 'negative') => void;
  onPendingHolidaysChange: (value: boolean) => void;
  onClearFilters: () => void;
}

export function HoursFilters({
  groups,
  searchTerm,
  selectedGroup,
  balanceFilter,
  pendingHolidaysOnly,
  onSearchChange,
  onGroupChange,
  onBalanceFilterChange,
  onPendingHolidaysChange,
  onClearFilters
}: HoursFiltersProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasActiveFilters = selectedGroup || balanceFilter !== 'all' || pendingHolidaysOnly;
  const activeFiltersCount = [
    selectedGroup,
    balanceFilter !== 'all' ? balanceFilter : null,
    pendingHolidaysOnly ? 'holidays' : null
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                       focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg
                   hover:bg-gray-50 transition-colors duration-200 relative"
        >
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="text-gray-700">Filtros</span>
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs 
                         rounded-full w-5 h-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Filters Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Group Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Agrupación
                  </label>
                  <select
                    value={selectedGroup}
                    onChange={(e) => onGroupChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todas las agrupaciones</option>
                    {groups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>

                {/* Balance Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Balance
                  </label>
                  <select
                    value={balanceFilter}
                    onChange={(e) => onBalanceFilterChange(e.target.value as 'all' | 'positive' | 'negative')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Todos los balances</option>
                    <option value="positive">Balance positivo</option>
                    <option value="negative">Balance negativo</option>
                  </select>
                </div>

                {/* Pending Holidays Filter */}
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={pendingHolidaysOnly}
                      onChange={(e) => onPendingHolidaysChange(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="text-sm text-gray-700">Solo empleados con festivos pendientes</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      onClearFilters();
                      setIsModalOpen(false);
                    }}
                    className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                  >
                    Limpiar filtros
                  </button>
                )}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}