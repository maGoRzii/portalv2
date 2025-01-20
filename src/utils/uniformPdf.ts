import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { UNIFORM_DATA } from '../data/uniforms';
import { formatDate } from './date';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface UniformRequest {
  id: string;
  first_name: string;
  last_name: string;
  created_at: string;
  uniform_items: Array<{
    item_id: string;
    size: string;
  }>;
}

interface SizeCount {
  [size: string]: number;
}

interface ItemCount {
  [key: string]: {
    total: number;
    sizes: SizeCount;
  };
}

interface CategoryCount {
  [key: string]: ItemCount;
}

export function generateUniformPDF(requests: UniformRequest[]) {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text('Resumen de Solicitudes de Uniformes', 14, 20);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 14, 30);

  // Calculate totals with size breakdown
  const totals: CategoryCount = {
    men: {},
    women: {}
  };

  requests.forEach(request => {
    request.uniform_items.forEach(item => {
      const category = item.item_id.startsWith('men-') ? 'men' : 'women';
      
      if (!totals[category][item.item_id]) {
        totals[category][item.item_id] = {
          total: 0,
          sizes: {}
        };
      }
      
      totals[category][item.item_id].total++;
      
      if (!totals[category][item.item_id].sizes[item.size]) {
        totals[category][item.item_id].sizes[item.size] = 0;
      }
      totals[category][item.item_id].sizes[item.size]++;
    });
  });

  let yPos = 40;

  // Men's uniforms summary
  doc.setFontSize(12);
  doc.text('Uniformes de Hombre', 14, yPos);
  yPos += 10;

  const menItems = UNIFORM_DATA.find(cat => cat.id === 'men')?.items || [];
  const menData: string[][] = [];

  menItems.forEach(item => {
    const itemData = totals.men[item.id];
    if (itemData) {
      // Add main item row
      menData.push([
        item.name,
        itemData.total.toString(),
        'Total'
      ]);
      
      // Add size breakdown rows
      Object.entries(itemData.sizes)
        .sort((a, b) => a[0].localeCompare(b[0])) // Sort sizes alphabetically
        .forEach(([size, count]) => {
          menData.push([
            '',
            count.toString(),
            `Talla ${size}`
          ]);
        });
      
      // Add spacing row
      menData.push(['', '', '']);
    }
  });

  doc.autoTable({
    startY: yPos,
    head: [['Artículo', 'Cantidad', 'Talla']],
    body: menData,
    theme: 'striped',
    headStyles: { fillColor: [66, 66, 66] },
    styles: { fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 50 }
    }
  });

  yPos = (doc as any).lastAutoTable.finalY + 20;

  // Women's uniforms summary
  doc.setFontSize(12);
  doc.text('Uniformes de Mujer', 14, yPos);
  yPos += 10;

  const womenItems = UNIFORM_DATA.find(cat => cat.id === 'women')?.items || [];
  const womenData: string[][] = [];

  womenItems.forEach(item => {
    const itemData = totals.women[item.id];
    if (itemData) {
      // Add main item row
      womenData.push([
        item.name,
        itemData.total.toString(),
        'Total'
      ]);
      
      // Add size breakdown rows
      Object.entries(itemData.sizes)
        .sort((a, b) => a[0].localeCompare(b[0])) // Sort sizes alphabetically
        .forEach(([size, count]) => {
          womenData.push([
            '',
            count.toString(),
            `Talla ${size}`
          ]);
        });
      
      // Add spacing row
      womenData.push(['', '', '']);
    }
  });

  doc.autoTable({
    startY: yPos,
    head: [['Artículo', 'Cantidad', 'Talla']],
    body: womenData,
    theme: 'striped',
    headStyles: { fillColor: [66, 66, 66] },
    styles: { fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 50 }
    }
  });

  yPos = (doc as any).lastAutoTable.finalY + 20;

  // Detailed requests
  doc.setFontSize(12);
  doc.text('Listado de Solicitudes', 14, yPos);
  yPos += 10;

  const requestsData = requests.map(request => {
    const items = request.uniform_items.map(item => {
      const category = UNIFORM_DATA.find(cat => 
        cat.items.some(i => i.id === item.item_id)
      );
      const itemData = category?.items.find(i => i.id === item.item_id);
      return `${itemData?.name || item.item_id} (${item.size})`;
    }).join(', ');

    return [
      `${request.first_name} ${request.last_name}`,
      formatDate(request.created_at),
      items
    ];
  });

  doc.autoTable({
    startY: yPos,
    head: [['Empleado', 'Fecha', 'Artículos']],
    body: requestsData,
    theme: 'striped',
    headStyles: { fillColor: [66, 66, 66] },
    styles: { fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 40 },
      2: { cellWidth: 90 }
    }
  });

  // Add total count
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.text(`Total de solicitudes: ${requests.length}`, 14, finalY);

  // Download the PDF
  doc.save('solicitudes-uniformes.pdf');
}