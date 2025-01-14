import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Employee } from '../../../types/hours';
import { NotificationsModal } from './NotificationsModal';

interface NotificationBell {
  employees: Employee[];
  modifications: any[];
}

export function NotificationBell({ employees, modifications }: NotificationBell) {
  const [showModal, setShowModal] = useState(false);
  const [alerts, setAlerts] = useState<{
    scheduleAlerts: any[];
    leaveAlerts: Employee[];
  }>({ scheduleAlerts: [], leaveAlerts: [] });

  useEffect(() => {
    const tenDaysFromNow = new Date();
    tenDaysFromNow.setDate(tenDaysFromNow.getDate() + 10);

    // Filter schedule modifications ending in the next 10 days
    const scheduleAlerts = modifications.filter(mod => {
      if (!mod.end_date) return false;
      const endDate = new Date(mod.end_date);
      return endDate <= tenDaysFromNow && endDate >= new Date();
    });

    // Filter employees with future leave in the next 10 days
    const leaveAlerts = employees.filter(emp => {
      if (emp.status !== 'future_leave' || !emp.leave_date) return false;
      const leaveDate = new Date(emp.leave_date);
      return leaveDate <= tenDaysFromNow && leaveDate >= new Date();
    });

    setAlerts({ scheduleAlerts, leaveAlerts });
  }, [employees, modifications]);

  const hasAlerts = alerts.scheduleAlerts.length > 0 || alerts.leaveAlerts.length > 0;

  return (
    <div className="relative">
      <button
        onClick={() => setShowModal(true)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell className="h-6 w-6 text-gray-600" />
        {hasAlerts && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            {alerts.scheduleAlerts.length + alerts.leaveAlerts.length}
          </span>
        )}
      </button>

      {showModal && (
        <NotificationsModal
          scheduleAlerts={alerts.scheduleAlerts}
          leaveAlerts={alerts.leaveAlerts}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}