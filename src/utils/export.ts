import { HoursRecord } from '../types/hours';
import { formatDate } from './date';

function escapeCSV(value: string | number): string {
  if (typeof value === 'number') return value.toString();
  return `"${String(value).replace(/"/g, '""')}"`;
}

export function generateCSV(headers: string[], rows: (string | number)[][]): string {
  return [
    headers.join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ].join('\n');
}

function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}-${formatDate(new Date().toISOString())}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export function exportHoursToCSV(records: HoursRecord[], employees: any[], filename: string): void {
  const headers = [
    'Empleado',
    'Semana',
    'Fecha Inicio',
    'Fecha Fin',
    'Horas Complementarias',
    'Horas Devueltas',
    'Horas Pagadas',
    'Balance'
  ];

  const rows = records.map(record => [
    employees.find(e => e.id === record.employee_id)?.full_name || 'Desconocido',
    record.week_code,
    formatDate(record.start_date),
    formatDate(record.end_date),
    record.extra_hours,
    record.returned_hours,
    record.paid_hours,
    record.balance
  ]);

  const csvContent = generateCSV(headers, rows);
  downloadCSV(csvContent, filename);
}