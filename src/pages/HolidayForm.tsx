import React from 'react';
import { CalendarCheck } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { PersonalInfo } from '../components/PersonalInfo';
import { HolidayList } from '../components/HolidayList';
import { Comments } from '../components/Comments';
import { useFormState } from '../hooks/useFormState';
import { AdminLoginButton } from '../components/AdminLoginButton';
import { BackButton } from '../components/BackButton';

export function HolidayForm() {
  const { 
    formData, 
    shifts, 
    isSubmitting,
    handleFormDataChange, 
    handleShiftChange, 
    handleSubmit 
  } = useFormState();

  return (
    <div className="min-h-screen bg-white py-8 px-4 relative">
      <Toaster position="top-center" />
      <BackButton />
      <AdminLoginButton />
      
      <div className="max-w-2xl mx-auto bg-gradient-to-b from-white to-gray-50 rounded-lg border border-gray-200 p-8 mt-16">
        <h1 className="text-3xl font-light text-gray-900 mb-8 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-subtle">
            <CalendarCheck className="h-6 w-6 text-white stroke-[1.5]" />
          </div>
          <span>Registro de Turnos Festivos</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <PersonalInfo 
            formData={formData}
            onChange={handleFormDataChange}
          />
          
          <HolidayList 
            shifts={shifts}
            onShiftChange={handleShiftChange}
          />
          
          <Comments
            value={formData.comments}
            onChange={(comments) => handleFormDataChange({ comments })}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-6 rounded-lg font-medium text-white
                     bg-gradient-subtle hover:bg-gradient-subtle-hover
                     transition-all duration-200 focus:outline-none focus:ring-2 
                     focus:ring-gray-900 focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Registro'}
          </button>
        </form>
      </div>
    </div>
  );
}