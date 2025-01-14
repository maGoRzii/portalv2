import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Employee } from '../types/hours';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export function generateEmployeesPDF(employees: Employee[]) {
  const doc = new jsPDF();
  
  // Sort employees alphabetically by last name
  const sortedEmployees = [...employees].sort((a, b) => 
    a.full_name.localeCompare(b.full_name, 'es')
  );

  // Add title
  doc.setFontSize(16);
  doc.text('Listado de Empleados', 14, 20);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 14, 30);

  // Table headers and data
  const headers = [['Nombre', 'Nº Empleado', 'Agrupación', 'Puesto', 'Horas']];
  const data = sortedEmployees.map(employee => [
    employee.full_name,
    employee.employee_number || '-',
    employee.group || '-',
    employee.position || '-',
    employee.contract_hours ? `${employee.contract_hours}h` : '-'
  ]);

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
      2: { cellWidth: 40 },
      3: { cellWidth: 40 },
      4: { cellWidth: 20 }
    }
  });

  // Add total count
  const finalY = (doc as any).lastAutoTable.finalY || 40;
  doc.text(`Total empleados: ${sortedEmployees.length}`, 14, finalY + 10);

  // Download the PDF
  doc.save('listado-empleados.pdf');
}