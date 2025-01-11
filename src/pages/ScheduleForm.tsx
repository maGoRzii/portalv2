import React from 'react';
import { Toaster } from 'react-hot-toast';
import { ScheduleForm } from '../components/schedule/ScheduleForm';
import { AdminLoginButton } from '../components/AdminLoginButton';
import { BackHomeButton } from '../components/BackHomeButton';

export function ScheduleFormPage() {
  return (
    <div className="min-h-screen bg-white py-8 px-4 relative">
      <Toaster position="top-center" />
      <BackHomeButton />
      <AdminLoginButton />
      <ScheduleForm />
    </div>
  );
}