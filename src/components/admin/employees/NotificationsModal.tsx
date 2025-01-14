import React from 'react';
import { X, Clock, UserMinus } from 'lucide-react';
import { formatDate } from '../../../utils/date';
import { Employee } from '../../../types/hours';

interface NotificationsModalProps {
  scheduleAlerts: any[];
  leaveAlerts: Employee[];
  onClose: () => void;
}

export function NotificationsModal({ scheduleAlerts, leaveAlerts, onClose }: NotificationsModalProps) {
  const hasAlerts = scheduleAlerts.length > 0 || leaveAlerts.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 pt-20">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Notificaciones</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {!hasAlerts ? (
            <p className="text-center text-gray-500">No hay notificaciones pendientes</p>
          ) : (
            <div className="space-y-6">
              {scheduleAlerts.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    Modificaciones de horario próximas a finalizar
                  </h4>
                  <div className="space-y-3">
                    {scheduleAlerts.map((alert) => (
                      <div key={alert.id} className="bg-blue-50 p-3 rounded-lg">
                        <p className="font-medium text-blue-900">{alert.employees.full_name}</p>
                        <p className="text-sm text-blue-700">
                          Finaliza el {formatDate(alert.end_date)}
                        </p>
                        <p className="text-sm text-blue-600 mt-1">
                          {alert.hours_change > 0 ? '+' : ''}{alert.hours_change}h
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {leaveAlerts.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <UserMinus className="h-4 w-4 text-orange-600" />
                    Bajas programadas próximas
                  </h4>
                  <div className="space-y-3">
                    {leaveAlerts.map((employee) => (
                      <div key={employee.id} className="bg-orange-50 p-3 rounded-lg">
                        <p className="font-medium text-orange-900">{employee.full_name}</p>
                        <p className="text-sm text-orange-700">
                          Fecha de baja: {formatDate(employee.leave_date!)}
                        </p>
                        <p className="text-sm text-orange-600 mt-1">
                          {employee.leave_reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}