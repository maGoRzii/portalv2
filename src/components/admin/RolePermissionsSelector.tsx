import React from 'react';
import { Check } from 'lucide-react';

interface Permission {
  id: string;
  label: string;
}

const PERMISSIONS: Permission[] = [
  { id: 'holidays', label: 'Festivos' },
  { id: 'uniforms', label: 'Uniformes' },
  { id: 'lanzadera', label: 'Lanzadera' },
  { id: 'requests', label: 'Peticiones' },
  { id: 'tasks', label: 'Tareas' },
  { id: 'hours', label: 'Horas' },
  { id: 'employees', label: 'Empleados' },
  { id: 'training', label: 'Formación' },
  { id: 'roles', label: 'Roles' },
  { id: 'settings', label: 'Ajustes' }
];

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
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg 
                   hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <span className="text-gray-700">{permission.label}</span>
          <div 
            className={`w-6 h-6 rounded flex items-center justify-center transition-colors
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