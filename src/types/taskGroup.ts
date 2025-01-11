export interface TaskGroup {
  id: string;
  name: string;
  color: string;
}

export const GROUP_COLORS = {
  DIRECTION: '#6B7280',    // Gris
  ADMIN: '#92400E',       // Marrón
  WOMEN: '#DB2777',       // Rosa
  MEN: '#2563EB',         // Azul
  KIDS: '#059669',        // Verde
  OPERATIONS: '#CA8A04',  // Amarillo
  CASHIER: '#7C3AED',     // Morado
  SINT: '#DC2626'         // Rojo
} as const;