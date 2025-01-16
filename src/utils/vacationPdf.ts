import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Employee } from '../types/hours';
import { VacationRecord } from '../types/vacation';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export function generateVacationPDF(
  employees: Employee[],
  records: Record<string, VacationRecord[]>,
  year: number
) {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(`Vacaciones ${year}`, 14, 20);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 14, 30);

  // Prepare data for table
  const data = employees.map(employee => {
    const employeeRecords = records[employee.id] || [];
    const yearRecord = employeeRecords.find(r => r.year === year);
    
    return [
      employee.full_name,
      employee.employee_number || '-',
      yearRecord?.days_taken || 0,
      yearRecord?.days_remaining || 0,
      employee.group || '-'
    ];
  });

  // Sort data by employee name
  data.sort((a, b) => a[0].localeCompare(b[0]));

  // Table headers
  const headers = [
    ['Nombre', 'Nº Empleado', 'Días Disfrutados', 'Días Pendientes', 'Agrupación']
  ];

  // Generate table
  doc.autoTable({
    head: headers,
    body: data,
    startY: 40,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [66, 66, 66] },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 30 },
      2: { cellWidth: 30, halign: 'center' },
      3: { cellWidth: 30, halign: 'center' },
      4: { cellWidth: 40 }
    }
  });

  // Add summary
  const finalY = (doc as any).lastAutoTable.finalY || 40;
  const totalEmployees = data.length;
  const totalPending = data.reduce((sum, row) => sum + (Number(row[3]) || 0), 0);
  
  doc.text(`Total empleados: ${totalEmployees}`, 14, finalY + 10);
  doc.text(`Total días pendientes: ${totalPending}`, 14, finalY + 20);

  // Download the PDF
  doc.save(`vacaciones-${year}.pdf`);
}