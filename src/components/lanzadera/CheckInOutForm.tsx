import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Truck, LogIn, LogOut, MapPin } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useGeolocation } from '../../hooks/useGeolocation';
import { LocationMap } from './LocationMap';

export function CheckInOutForm() {
  const [driverName, setDriverName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { latitude, longitude, error: locationError, loading: locationLoading } = useGeolocation();

  const handleSubmit = async (type: 'check_in' | 'check_out') => {
    if (!driverName.trim()) {
      toast.error('Por favor, introduce tu nombre');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('lanzadera_records')
        .insert({
          driver_name: driverName.trim(),
          type,
          latitude,
          longitude,
          location_error: locationError,
        });

      if (error) throw error;

      toast.success('Solicitud enviada correctamente');
      setDriverName('');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al enviar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-subtle">
          <Truck className="h-6 w-6 text-white stroke-[1.5]" />
        </div>
        <h2 className="text-3xl font-light text-gray-900">
          Fichaje Lanzadera
        </h2>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          value={driverName}
          onChange={(e) => setDriverName(e.target.value)}
          placeholder="Nombre del conductor"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                   focus:ring-2 focus:ring-gray-900 focus:border-gray-900
                   placeholder-gray-500 text-gray-900"
          disabled={isSubmitting}
        />

        {locationLoading ? (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="animate-spin h-4 w-4 border-2 border-gray-900 rounded-full border-t-transparent" />
            Obteniendo ubicación...
          </div>
        ) : locationError ? (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <MapPin className="h-4 w-4 stroke-[1.5]" />
            Error al obtener ubicación: {locationError}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <MapPin className="h-4 w-4 stroke-[1.5]" />
              Ubicación obtenida correctamente
            </div>
            <LocationMap latitude={latitude!} longitude={longitude!} />
          </>
        )}

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSubmit('check_in')}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                     text-white bg-gradient-to-b from-green-600 to-green-700 
                     hover:from-green-500 hover:to-green-600
                     transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogIn className="h-5 w-5 stroke-[1.5]" />
            Entrada
          </button>

          <button
            onClick={() => handleSubmit('check_out')}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                     text-white bg-gradient-to-b from-red-600 to-red-700
                     hover:from-red-500 hover:to-red-600
                     transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="h-5 w-5 stroke-[1.5]" />
            Salida
          </button>
        </div>
      </div>
    </div>
  );
}