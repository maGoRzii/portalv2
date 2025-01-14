import React, { useState, useEffect } from 'react';
import { X, Edit2, User, Users, Clock } from 'lucide-react';
import { Employee, ContractHoursModification } from '../../../types/hours';
import { supabase } from '../../../lib/supabase';
import { formatDate } from '../../../utils/date';

interface EmployeeDetailsModalProps {
  employee: Employee;
  onClose: () => void;
  onEdit: (employee: Employee) => void;
}

export function EmployeeDetailsModal({ employee, onClose, onEdit }: EmployeeDetailsModalProps) {
  const [hoursModifications, setHoursModifications] = useState<ContractHoursModification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModification, setShowAddModification] = useState(false);
  const [newModification, setNewModification] = useState({
    hours_change: 0,
    start_date: '',
    end_date: '',
    reason: ''
  });

  useEffect(() => {
    loadHoursModifications();
  }, [employee.id]);

  const loadHoursModifications = async () => {
    try {
      const { data, error } = await supabase
        .from('contract_hours_modifications')
        .select('*')
        .eq('employee_id', employee.id)
        .order('start_date', { ascending: false });

      if (error) throw error;
      setHoursModifications(data || []);
    } catch (error) {
      console.error('Error loading hours modifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddModification = async () => {
    try {
      const { error } = await supabase
        .from('contract_hours_modifications')
        .insert({
          employee_id: employee.id,
          hours_change: newModification.hours_change,
          start_date: newModification.start_date,
          end_date: newModification.end_date || null,
          reason: newModification.reason || null
        });

      if (error) throw error;
      
      setShowAddModification(false);
      setNewModification({ hours_change: 0, start_date: '', end_date: '', reason: '' });
      loadHoursModifications();
    } catch (error) {
      console.error('Error adding modification:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Detalles del Empleado
              </h2>
              {employee.employee_number && (
                <p className="text-sm text-gray-500 mt-1">
                  Nº Empleado: {employee.employee_number}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(employee)}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Edit2 className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Status Information */}
            {employee.status !== 'active' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {employee.status === 'future_leave' ? (
                    <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                      Baja a futuro
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      Baja
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Fecha de baja</p>
                    <p className="text-gray-900">{formatDate(employee.leave_date!)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Motivo</p>
                    <p className="text-gray-900">{employee.leave_reason}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <User className="h-4 w-4" />
                  <span className="text-sm">Nombre</span>
                </div>
                <p className="text-gray-900 font-medium">{employee.full_name}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Agrupación</span>
                </div>
                <p className="text-gray-900">{employee.group || '-'}</p>
              </div>

              {employee.position && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Puesto</p>
                  <div className="flex items-center gap-2">
                    {employee.position_code && (
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-md">
                        {employee.position_code}
                      </span>
                    )}
                    <span className="text-gray-900">{employee.position}</span>
                  </div>
                </div>
              )}

              {employee.contract_hours && (
                <div>
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Horas Contrato Base</span>
                  </div>
                  <p className="text-gray-900">{employee.contract_hours}h</p>
                </div>
              )}
            </div>

            {/* Hours Modifications */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Modificaciones de Horas</h3>
                <button
                  onClick={() => setShowAddModification(true)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Añadir modificación
                </button>
              </div>

              {showAddModification && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cambio de Horas
                      </label>
                      <input
                        type="number"
                        value={newModification.hours_change}
                        onChange={(e) => setNewModification(prev => ({
                          ...prev,
                          hours_change: Number(e.target.value)
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        step="0.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha Inicio
                      </label>
                      <input
                        type="date"
                        value={newModification.start_date}
                        onChange={(e) => setNewModification(prev => ({
                          ...prev,
                          start_date: e.target.value
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha Fin (opcional)
                      </label>
                      <input
                        type="date"
                        value={newModification.end_date}
                        onChange={(e) => setNewModification(prev => ({
                          ...prev,
                          end_date: e.target.value
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Motivo (opcional)
                      </label>
                      <input
                        type="text"
                        value={newModification.reason}
                        onChange={(e) => setNewModification(prev => ({
                          ...prev,
                          reason: e.target.value
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => setShowAddModification(false)}
                      className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleAddModification}
                      className="px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {hoursModifications.map((mod) => (
                  <div key={mod.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Cambio de Horas</p>
                        <p className={`text-lg font-medium ${mod.hours_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {mod.hours_change > 0 ? '+' : ''}{mod.hours_change}h
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Período</p>
                        <p className="text-gray-900">
                          {formatDate(mod.start_date)} - {mod.end_date ? formatDate(mod.end_date) : 'Sin fecha fin'}
                        </p>
                      </div>
                      {mod.reason && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500">Motivo</p>
                          <p className="text-gray-900">{mod.reason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            {(employee.email || employee.phone) && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Contacto</h3>
                <div className="space-y-1">
                  {employee.email && (
                    <p className="text-gray-900">{employee.email}</p>
                  )}
                  {employee.phone && (
                    <p className="text-gray-600">{employee.phone}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}