import React from 'react';
import { Toaster } from 'react-hot-toast';
import { CheckInOutForm } from '../components/lanzadera/CheckInOutForm';
import { AdminLoginButton } from '../components/AdminLoginButton';
import { BackButton } from '../components/BackButton';

export function LanzaderaForm() {
  return (
    <div className="min-h-screen bg-white py-8 px-4 relative">
      <Toaster position="top-center" />
      <BackButton />
      <AdminLoginButton />
      
      <div className="max-w-lg mx-auto bg-gradient-to-b from-white to-gray-50 rounded-lg border border-gray-200 p-8 mt-16">
        <CheckInOutForm />
      </div>
    </div>
  );
}