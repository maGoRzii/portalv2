import React from 'react';
import { Calendar, Shirt, Truck, FileText, Settings, Layout, GraduationCap } from 'lucide-react';
import { NavItem } from './NavItem';

export function DashboardNav() {
  return (
    <nav className="space-y-1">
      <NavItem
        icon={<Calendar />}
        label="Festivos"
        path="/admin/holidays"
      />
      <NavItem
        icon={<Shirt />}
        label="Uniformes"
        path="/admin/uniforms"
      />
      <NavItem
        icon={<Truck />}
        label="Lanzadera"
        path="/admin/lanzadera"
      />
      <NavItem
        icon={<FileText />}
        label="Peticiones"
        path="/admin/requests"
      />
      <NavItem
        icon={<Layout />}
        label="Tareas"
        path="/admin/tasks"
      />
      <NavItem
        icon={<GraduationCap />}
        label="Formación"
        path="/admin/training"
      />
      <NavItem
        icon={<Settings />}
        label="Ajustes"
        path="/admin/settings"
      />
    </nav>
  );
}