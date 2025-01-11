import { Request } from '../types/request';
import { formatDate } from './date';

function escapeCSV(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export function generateCSV(headers: string[], rows: string[][]): string {
  return [
    headers.join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ].join('\n');
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}-${formatDate(new Date().toISOString())}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export function exportRequestsToCSV(requests: Request[], filename: string): void {
  const headers = [
    'Nombre',
    'Apellidos',
    'Mensaje',
    'Archivos adjuntos',
    'Fecha de solicitud'
  ];

  const rows = requests.map(request => [
    request.first_name,
    request.last_name,
    request.message,
    (request.attachments || []).map(path => path.split('/').pop() || '').join('; '),
    formatDate(request.created_at)
  ]);

  const csvContent = generateCSV(headers, rows);
  downloadCSV(csvContent, filename);
}