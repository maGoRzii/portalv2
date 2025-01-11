import React from 'react';
import { User } from 'lucide-react';
import { FormData } from '../types';

interface PersonalInfoProps {
  formData: FormData;
  onChange: (data: Partial<FormData>) => void;
}

export function PersonalInfo({ formData, onChange }: PersonalInfoProps) {
  return (
    <div className="animate-slide-in" style={{ opacity: 0 }}>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <User size={18} className="text-blue-600" />
            Nombre
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 
                     focus:ring-blue-500 transition-colors duration-200 bg-white/50"
            value={formData.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            placeholder="Tu nombre"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Apellidos
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 
                     focus:ring-blue-500 transition-colors duration-200 bg-white/50"
            value={formData.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            placeholder="Tus apellidos"
          />
        </div>
      </div>
    </div>
  );
}