import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardHeader } from '../components/admin/DashboardHeader';
import { DashboardNav } from '../components/admin/DashboardNav';
import { HolidaySubmissions } from '../components/admin/holidays/HolidaySubmissions';
import { UniformSubmissions } from '../components/admin/uniforms/UniformSubmissions';
import { LanzaderaRequests } from '../components/admin/lanzadera/LanzaderaRequests';
import { Requests } from '../components/admin/requests/Requests';
import { TaskBoard } from '../components/admin/tasks/TaskBoard';
import { FeatureFlags } from '../components/admin/FeatureFlags';
import { PrintSubmission } from '../pages/PrintSubmission';
import { PrintSummary } from '../pages/PrintSummary';
import { TrainingGroupsPage } from '../pages/admin/TrainingGroupsPage';
import { TrainingEntriesPage } from '../pages/admin/TrainingEntriesPage';
import { useAuth } from '../hooks/useAuth';

export function AdminLayout() {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader onLogout={signOut} />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-4">
              <DashboardNav />
            </div>
          </div>

          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <Routes>
              <Route index element={<Navigate to="holidays" replace />} />
              <Route path="holidays" element={<HolidaySubmissions />} />
              <Route path="uniforms" element={<UniformSubmissions />} />
              <Route path="lanzadera" element={<LanzaderaRequests />} />
              <Route path="requests" element={<Requests />} />
              <Route path="tasks" element={<TaskBoard />} />
              <Route path="training" element={<TrainingGroupsPage />} />
              <Route path="training/:slug" element={<TrainingEntriesPage />} />
              <Route path="settings" element={<FeatureFlags />} />
              <Route path="print/:id" element={<PrintSubmission />} />
              <Route path="print-summary" element={<PrintSummary />} />
              <Route path="*" element={<Navigate to="holidays" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}