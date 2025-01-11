import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Settings } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface FeatureFlag {
  name: string;
  enabled: boolean;
}

const FLAG_DISPLAY_NAMES: Record<string, string> = {
  'holidays_enabled': 'Formulario Festivos',
  'uniforms_enabled': 'Solicitud de Uniformes',
  'lanzadera_enabled': 'Fichaje Lanzadera',
  'requests_enabled': 'Peticiones'
};

export function FeatureFlags() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadFlags();
  }, []);

  const loadFlags = async () => {
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('name');

      if (error) throw error;
      setFlags(data || []);
    } catch (error) {
      console.error('Error loading flags:', error);
      toast.error('Error al cargar las configuraciones');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (name: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('feature_flags')
        .update({ 
          enabled,
          updated_at: new Date().toISOString(),
          updated_by: user?.id
        })
        .eq('name', name);

      if (error) throw error;
      
      setFlags(flags.map(flag => 
        flag.name === name ? { ...flag, enabled } : flag
      ));
      
      toast.success('Configuración actualizada');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar la configuración');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Configuración de Funcionalidades
        </h2>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {flags
            .filter(flag => flag.name !== 'schedule_enabled')
            .map((flag) => (
              <li key={flag.name} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {FLAG_DISPLAY_NAMES[flag.name] || flag.name}
                    </h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={flag.enabled}
                      onChange={(e) => handleToggle(flag.name, e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                                peer-focus:ring-blue-300 rounded-full peer 
                                peer-checked:after:translate-x-full peer-checked:after:border-white 
                                after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                after:bg-white after:border-gray-300 after:border after:rounded-full 
                                after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                    </div>
                  </label>
                </div>
              </li>
          ))}
        </ul>
      </div>
    </div>
  );
}