import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatDate } from './date';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export function generatePDF(date: string, submissions: any[]) {
  const doc = new jsPDF();
  
  // Filter and sort submissions alphabetically by last name, then first name
  const filteredSubmissions = submissions
    .filter(submission =>
      submission.holiday_shifts.some(shift => shift.holiday_date === date)
    )
    .sort((a, b) => {
      // First compare last names
      const lastNameComparison = a.last_name.localeCompare(b.last_name, 'es');
      if (lastNameComparison !== 0) return lastNameComparison;
      
      // If last names are equal, compare first names
      return a.first_name.localeCompare(b.first_name, 'es');
    });

  // Add title
  doc.setFontSize(16);
  doc.text('Lista de Personal - Día Festivo', 14, 20);
  
  // Add date
  doc.setFontSize(12);
  doc.text(formatDate(date), 14, 30);

  // Table headers and data
  const headers = [['Nombre', 'Apellidos', 'Compensación', 'Comentarios']];
  const data = filteredSubmissions.map(submission => {
    const shift = submission.holiday_shifts.find(s => s.holiday_date === date);
    return [
      submission.first_name,
      submission.last_name,
      shift?.compensation_type === 'double' ? 'Pago doble' : 'Día libre',
      submission.comments || '-'
    ];
  });

  // Generate table
  doc.autoTable({
    head: headers,
    body: data,
    startY: 40,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [66, 66, 66] }
  });

  // Add total count
  const finalY = (doc as any).lastAutoTable.finalY || 40;
  doc.text(`Total registros: ${filteredSubmissions.length}`, 14, finalY + 10);

  // Download the PDF
  doc.save(`personal-festivo-${date}.pdf`);
}