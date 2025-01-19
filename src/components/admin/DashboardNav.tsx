import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Shirt, Truck, FileText, Settings, Layout, GraduationCap, Users, Clock, Shield, Home, Palmtree, UserCircle } from 'lucide-react';
import { NavItem } from './NavItem';
import { useRole } from '../../hooks/useRole';

export function DashboardNav() {
  const { hasPermission, role } = useRole();

  return (
    <nav className="space-y-1">
      <NavItem
        icon={<Home />}
        label="Inicio"
        path="/admin"
      />

      <NavItem
        icon={<UserCircle />}
        label="Mi Perfil"
        path="/admin/profile"
      />

      {hasPermission('holidays') && (
        <NavItem
          icon={<Calendar />}
          label="Festivos"
          path="/admin/holidays"
        />
      )}
      
      {hasPermission('uniforms') && (
        <NavItem
          icon={<Shirt />}
          label="Uniformes"
          path="/admin/uniforms"
        />
      )}
      
      {hasPermission('lanzadera') && (
        <NavItem
          icon={<Truck />}
          label="Lanzadera"
          path="/admin/lanzadera"
        />
      )}
      
      {hasPermission('requests') && (
        <NavItem
          icon={<FileText />}
          label="Peticiones"
          path="/admin/requests"
        />
      )}
      
      {hasPermission('tasks') && (
        <NavItem
          icon={<Layout />}
          label="Tareas"
          path="/admin/tasks"
        />
      )}
      
      {hasPermission('hours') && (
        <NavItem
          icon={<Clock />}
          label="Horas"
          path="/admin/hours"
        />
      )}
      
      {hasPermission('employees') && (
        <NavItem
          icon={<Users />}
          label="Empleados"
          path="/admin/employees"
        />
      )}

      {hasPermission('vacations') && (
        <NavItem
          icon={<Palmtree />}
          label="Vacaciones"
          path="/admin/vacations"
        />
      )}
      
      {hasPermission('training') && (
        <NavItem
          icon={<GraduationCap />}
          label="Formación"
          path="/admin/training"
        />
      )}

      {role === 'developer' && (
        <NavItem
          icon={<Shield />}
          label="Roles"
          path="/admin/roles"
        />
      )}
      
      {hasPermission('settings') && (
        <NavItem
          icon={<Settings />}
          label="Ajustes"
          path="/admin/settings"
        />
      )}
    </nav>
  );
}