import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { LeaveNotification } from '../components/admin/employees/LeaveNotification';
import { createRoot } from 'react-dom/client';

export function useEmployeeStatusCheck() {
  const [notificationContainer, setNotificationContainer] = useState<HTMLDivElement | null>(null);
  const [notificationRoot, setNotificationRoot] = useState<any>(null);

  useEffect(() => {
    // Create container for notification
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    
    setNotificationContainer(container);
    setNotificationRoot(root);

    return () => {
      document.body.removeChild(container);
    };
  }, []);

  useEffect(() => {
    const checkAndUpdateStatuses = async () => {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      try {
        // Check and update future leaves
        const { data: futureLeaves, error: leavesError } = await supabase
          .from('employees')
          .select('*')
          .eq('status', 'future_leave')
          .lte('leave_date', today);

        if (leavesError) throw leavesError;

        // Update status to inactive for employees whose leave date has arrived
        if (futureLeaves?.length) {
          const { error: updateError } = await supabase
            .from('employees')
            .update({ status: 'inactive' })
            .in('id', futureLeaves.map(emp => emp.id));

          if (updateError) throw updateError;
        }

        // Check for employees with leave date tomorrow
        const { data: tomorrowLeaves, error: tomorrowError } = await supabase
          .from('employees')
          .select('*')
          .eq('status', 'future_leave')
          .eq('leave_date', tomorrowStr);

        if (tomorrowError) throw tomorrowError;

        // Show notification for employees leaving tomorrow
        if (tomorrowLeaves?.length && notificationRoot) {
          const employeeNames = tomorrowLeaves.map(emp => emp.full_name).join(', ');
          notificationRoot.render(
            React.createElement(LeaveNotification, {
              employeeNames,
              onClose: () => notificationRoot.render(null)
            })
          );
        }

        // Delete expired hour modifications
        const { error: modsError } = await supabase
          .from('contract_hours_modifications')
          .delete()
          .lte('end_date', today);

        if (modsError) throw modsError;

      } catch (error) {
        console.error('Error checking employee statuses:', error);
      }
    };

    // Run check immediately and then every hour
    checkAndUpdateStatuses();
    const interval = setInterval(checkAndUpdateStatuses, 3600000); // 1 hour

    return () => {
      clearInterval(interval);
      if (notificationRoot) {
        notificationRoot.render(null);
      }
    };
  }, [notificationRoot]);
}