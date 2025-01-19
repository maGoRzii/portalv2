import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRole } from '../../hooks/useRole';
import { GraduationCap, Calendar, Shirt, Truck, FileText, Users, Clock, Settings, Shield, Layout, Palmtree, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VersionUpdatePopup } from './VersionUpdatePopup';
import { useVersionPopup } from '../../hooks/useVersionPopup';

export function WelcomeDashboard() {
  const { user } = useAuth();
  const { hasPermission } = useRole();
  const navigate = useNavigate();
  const { showPopup, handleClose } = useVersionPopup();

  const modules = [
    {
      id: 'profile',
      name: 'Mi Perfil',
      description: 'Gestiona tu información personal y preferencias',
      icon: UserCircle,
      color: 'bg-gray-500',
      path: '/admin/profile'
    },
    {
      id: 'holidays',
      name: 'Festivos',
      description: 'Gestión de solicitudes de días festivos',
      icon: Calendar,
      color: 'bg-blue-500',
      path: '/admin/holidays'
    },
    {
      id: 'uniforms',
      name: 'Uniformes',
      description: 'Gestión de solicitudes de uniformes',
      icon: Shirt,
      color: 'bg-purple-500',
      path: '/admin/uniforms'
    },
    {
      id: 'lanzadera',
      name: 'Lanzadera',
      description: 'Control de fichajes de lanzadera',
      icon: Truck,
      color: 'bg-green-500',
      path: '/admin/lanzadera'
    },
    {
      id: 'requests',
      name: 'Peticiones',
      description: 'Gestión de peticiones y justificantes',
      icon: FileText,
      color: 'bg-yellow-500',
      path: '/admin/requests'
    },
    {
      id: 'tasks',
      name: 'Tareas',
      description: 'Tablero de tareas y seguimiento',
      icon: Layout,
      color: 'bg-orange-500',
      path: '/admin/tasks'
    },
    {
      id: 'employees',
      name: 'Empleados',
      description: 'Gestión de empleados',
      icon: Users,
      color: 'bg-red-500',
      path: '/admin/employees'
    },
    {
      id: 'hours',
      name: 'Horas',
      description: 'Control de horas complementarias',
      icon: Clock,
      color: 'bg-indigo-500',
      path: '/admin/hours'
    },
    {
      id: 'vacations',
      name: 'Vacaciones',
      description: 'Gestión de vacaciones de empleados',
      icon: Palmtree,
      color: 'bg-teal-500',
      path: '/admin/vacations'
    },
    {
      id: 'training',
      name: 'Formación',
      description: 'Gestión de contenido formativo',
      icon: GraduationCap,
      color: 'bg-teal-500',
      path: '/admin/training'
    },
    {
      id: 'settings',
      name: 'Ajustes',
      description: 'Configuración del sistema',
      icon: Settings,
      color: 'bg-gray-500',
      path: '/admin/settings'
    }
  ];

  const availableModules = modules.filter(module => 
    module.id === 'profile' || hasPermission(module.id)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-gray-900">
          Bienvenido al Panel de Control
        </h1>
        <p className="mt-1 text-gray-500">
          {user?.user_metadata?.name || user?.email}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {availableModules.map((module) => (
          <button
            key={module.id}
            onClick={() => navigate(module.path)}
            className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 
                     hover:shadow-md transition-all duration-200 text-left"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${module.color} text-white`}>
                <module.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{module.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{module.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {showPopup && <VersionUpdatePopup onClose={handleClose} />}
    </div>
  );
}