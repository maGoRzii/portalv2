import React from 'react';
import { Check } from 'lucide-react';

const PERMISSIONS = [
  { id: 'holidays', label: 'Festivos', description: 'Gestión de solicitudes de días festivos' },
  { id: 'uniforms', label: 'Uniformes', description: 'Gestión de solicitudes de uniformes' },
  { id: 'lanzadera', label: 'Lanzadera', description: 'Control de fichajes de lanzadera' },
  { id: 'requests', label: 'Peticiones', description: 'Gestión de peticiones y justificantes' },
  { id: 'tasks', label: 'Tareas', description: 'Tablero de tareas y seguimiento' },
  { id: 'hours', label: 'Horas', description: 'Control de horas complementarias' },
  { id: 'employees', label: 'Empleados', description: 'Gestión de empleados' },
  { id: 'vacations', label: 'Vacaciones', description: 'Gestión de vacaciones de empleados' },
  { id: 'training', label: 'Formación', description: 'Gestión de contenido formativo' },
  { id: 'roles', label: 'Roles', description: 'Gestión de roles y permisos' },
  { id: 'settings', label: 'Ajustes', description: 'Configuración del sistema' }
] as const;

interface RolePermissionsSelectorProps {
  selectedPermissions: string[];
  onChange: (permissions: string[]) => void;
}

export function RolePermissionsSelector({ selectedPermissions, onChange }: RolePermissionsSelectorProps) {
  const togglePermission = (permission: string) => {
    onChange(
      selectedPermissions.includes(permission)
        ? selectedPermissions.filter(p => p !== permission)
        : [...selectedPermissions, permission]
    );
  };

  return (
    <div className="space-y-4">
      {PERMISSIONS.map((permission) => (
        <label
          key={permission.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg 
                   hover:bg-gray-100 transition-colors cursor-pointer group"
        >
          <div className="flex-1">
            <span className="text-gray-900 font-medium block">{permission.label}</span>
            <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
              {permission.description}
            </span>
          </div>
          <div 
            className={`ml-4 w-6 h-6 rounded flex items-center justify-center transition-colors
              ${selectedPermissions.includes(permission.id)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200'
              }`}
            onClick={() => togglePermission(permission.id)}
          >
            {selectedPermissions.includes(permission.id) && (
              <Check className="h-4 w-4" />
            )}
          </div>
        </label>
      ))}
    </div>
  );
}