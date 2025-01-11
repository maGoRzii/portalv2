import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { DashboardHeader } from '../components/admin/DashboardHeader';
import { DashboardNav } from '../components/admin/DashboardNav';
import { BackHomeButton } from '../components/BackHomeButton';

export function AdminDashboard() {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <BackHomeButton />
      <DashboardHeader onLogout={signOut} />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-4">
              <DashboardNav />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}