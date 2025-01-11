export interface TaskLabel {
  id: string;
  name: string;
  color: string;
}

export const TASK_LABELS = [
  { id: 'direction', name: 'Dirección', color: '#6B7280' },
  { id: 'admin', name: 'Administración', color: '#92400E' },
  { id: 'women', name: 'Mujer', color: '#DB2777' },
  { id: 'men', name: 'Hombre', color: '#2563EB' },
  { id: 'kids', name: 'Niño', color: '#059669' },
  { id: 'cashier', name: 'Caja', color: '#7C3AED' },
  { id: 'fitting-room', name: 'Probador', color: '#EAB308' },
  { id: 'operations', name: 'Operaciones', color: '#06B6D4' },
  { id: 'sint', name: 'Sint', color: '#DC2626' }
] as const;