import React from 'react';
import { Toaster } from 'react-hot-toast';
import { RequestForm } from '../components/requests/RequestForm';
import { AdminLoginButton } from '../components/AdminLoginButton';
import { BackButton } from '../components/BackButton';

export function RequestFormPage() {
  return (
    <div className="min-h-screen bg-white py-8 px-4 relative">
      <Toaster position="top-center" />
      <BackButton />
      <AdminLoginButton />
      <RequestForm />
    </div>
  );
}