import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardHeader } from '../components/admin/DashboardHeader';
import { DashboardNav } from '../components/admin/DashboardNav';
import { WelcomeDashboard } from '../components/admin/WelcomeDashboard';
import { HolidaySubmissions } from '../components/admin/holidays/HolidaySubmissions';
import { UniformSubmissions } from '../components/admin/uniforms/UniformSubmissions';
import { LanzaderaRequests } from '../components/admin/lanzadera/LanzaderaRequests';
import { Requests } from '../components/admin/requests/Requests';
import { TaskBoard } from '../components/admin/tasks/TaskBoard';
import { HoursManagement } from '../components/admin/hours/HoursManagement';
import { EmployeeManagement } from '../components/admin/employees/EmployeeManagement';
import { VacationManagement } from '../components/admin/vacations/VacationManagement';
import { TrainingGroupsPage } from '../pages/admin/TrainingGroupsPage';
import { TrainingEntriesPage } from '../pages/admin/TrainingEntriesPage';
import { FeatureFlags } from '../components/admin/FeatureFlags';
import { RoleManagement } from '../components/admin/RoleManagement';
import { PrintSubmission } from '../pages/PrintSubmission';
import { PrintSummary } from '../pages/PrintSummary';
import { ProfileView } from '../components/admin/profile/ProfileView';
import { useAuth } from '../hooks/useAuth';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

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
              <Route index element={<WelcomeDashboard />} />
              <Route path="profile" element={<ProfileView />} />
              <Route path="holidays" element={<ProtectedRoute requiredPermission="holidays"><HolidaySubmissions /></ProtectedRoute>} />
              <Route path="uniforms" element={<ProtectedRoute requiredPermission="uniforms"><UniformSubmissions /></ProtectedRoute>} />
              <Route path="lanzadera" element={<ProtectedRoute requiredPermission="lanzadera"><LanzaderaRequests /></ProtectedRoute>} />
              <Route path="requests" element={<ProtectedRoute requiredPermission="requests"><Requests /></ProtectedRoute>} />
              <Route path="tasks" element={<ProtectedRoute requiredPermission="tasks"><TaskBoard /></ProtectedRoute>} />
              <Route path="hours" element={<ProtectedRoute requiredPermission="hours"><HoursManagement /></ProtectedRoute>} />
              <Route path="employees" element={<ProtectedRoute requiredPermission="employees"><EmployeeManagement /></ProtectedRoute>} />
              <Route path="vacations" element={<ProtectedRoute requiredPermission="vacations"><VacationManagement /></ProtectedRoute>} />
              <Route path="training" element={<ProtectedRoute requiredPermission="training"><TrainingGroupsPage /></ProtectedRoute>} />
              <Route path="training/:slug" element={<ProtectedRoute requiredPermission="training"><TrainingEntriesPage /></ProtectedRoute>} />
              <Route path="settings" element={<ProtectedRoute requiredPermission="settings"><FeatureFlags /></ProtectedRoute>} />
              <Route path="roles" element={<ProtectedRoute requiredPermission="developer"><RoleManagement /></ProtectedRoute>} />
              <Route path="print/:id" element={<PrintSubmission />} />
              <Route path="print-summary" element={<PrintSummary />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}