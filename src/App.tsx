import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LandingPage } from './pages/LandingPage';
import { HolidayForm } from './pages/HolidayForm';
import { UniformForm } from './pages/UniformForm';
import { LanzaderaForm } from './pages/LanzaderaForm';
import { RequestFormPage } from './pages/RequestForm';
import { AdminLogin } from './pages/AdminLogin';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { HolidayDatePrint } from './pages/HolidayDatePrint';
import { TrainingGroupPage } from './pages/TrainingGroupPage';
import { TrainingEntryPage } from './pages/TrainingEntryPage';
import { TrainingGroupsPage } from './pages/TrainingGroupsPage';

export default function App() {
  return (
    <HashRouter>
      <Toaster position="top-center" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/holidays" element={<HolidayForm />} />
        <Route path="/uniforms" element={<UniformForm />} />
        <Route path="/lanzadera" element={<LanzaderaForm />} />
        <Route path="/requests" element={<RequestFormPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/training" element={<TrainingGroupsPage />} />
        <Route path="/training/:slug" element={<TrainingGroupPage />} />
        <Route path="/training/:groupSlug/:entrySlug" element={<TrainingEntryPage />} />

        {/* Protected Admin Routes */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Print Routes */}
        <Route
          path="/admin/print-date"
          element={
            <ProtectedRoute>
              <HolidayDatePrint />
            </ProtectedRoute>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}