import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Shirt, Truck, FileText, Phone, GraduationCap } from 'lucide-react';
import { AdminLoginButton } from '../components/AdminLoginButton';
import { useFeatureFlags } from '../hooks/useFeatureFlags';
import { MenuItem } from '../components/MenuItem';

export function LandingPage() {
  const navigate = useNavigate();
  const { flags, loading } = useFeatureFlags();

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <AdminLoginButton />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Portal Jonquera 16549
          </h1>
          <p className="text-lg text-gray-600">
            Gestiona tus solicitudes de manera fácil y eficien
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mb-16">
          <MenuItem
            icon={<Calendar className="stroke-[1.5]" />}
            title="Formulario Festivos"
            description="Solicita tus días festivos y elige tu compensación"
            onClick={() => navigate('/holidays')}
            disabled={!loading && !flags.holidays_enabled}
          />
          
          <MenuItem
            icon={<Shirt className="stroke-[1.5]" />}
            title="Petición de Uniformes"
            description="Solicita tu uniforme de trabajo con tus tallas"
            onClick={() => navigate('/uniforms')}
            disabled={!loading && !flags.uniforms_enabled}
          />
          
          <MenuItem
            icon={<Truck className="stroke-[1.5]" />}
            title="Fichaje Lanzadera"
            description="Registra tu entrada y salida del servicio de lanzadera"
            onClick={() => navigate('/lanzadera')}
            disabled={!loading && !flags.lanzadera_enabled}
          />

          {(!loading && flags.training_enabled) && (
            <MenuItem
              icon={<GraduationCap className="stroke-[1.5]" />}
              title="Formación"
              description="Accede a todos los recursos formativos de la tienda"
              onClick={() => navigate('/training')}
            />
          )}

          <MenuItem
            icon={<FileText className="stroke-[1.5]" />}
            title="Peticiones / Justificantes"
            description="Peticiones referentes a cambios de horarios, devolución de horas..."
            onClick={() => navigate('/requests')}
            disabled={!loading && !flags.requests_enabled}
          />
        </div>

        <div className="mt-12 text-center">
          <a 
            href="tel:872048762" 
            className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <Phone className="h-5 w-5 text-gray-600" />
            <span className="text-lg">Teléfono de la Tienda: <span className="font-medium">872 048 762</span></span>
          </a>
        </div>
      </div>
    </div>
  );
}