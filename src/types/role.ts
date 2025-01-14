export type UserRole = 'developer' | 'admin' | 'administrative' | 'manager';

export interface UserRoleInfo {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export const ROLE_PERMISSIONS = {
  developer: ['*'],
  admin: [
    'holidays',
    'uniforms',
    'lanzadera',
    'requests',
    'tasks',
    'hours',
    'employees',
    'training',
    'settings'
  ],
  administrative: [
    'holidays',
    'uniforms',
    'requests',
    'tasks'
  ],
  manager: [
    'holidays',
    'uniforms',
    'lanzadera',
    'requests',
    'tasks',
    'employees'
  ]
} as const;