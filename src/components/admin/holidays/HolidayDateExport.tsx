import React, { useState } from 'react';
import { FileText, Calendar } from 'lucide-react';
import { HOLIDAYS } from '../../../data/holidays';
import { formatDate } from '../../../utils/date';
import { generatePDF } from '../../../utils/pdf';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';

interface HolidayDateExportProps {
  onExport?: (date: string) => void;
}

export function HolidayDateExport({ onExport }: HolidayDateExportProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!selectedDate) {
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('holiday_submissions')
        .select(`
          *,
          holiday_shifts (
            holiday_date,
            compensation_type
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      generatePDF(selectedDate, data || []);
      toast.success('PDF generado correctamente');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error al generar el PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-gray-500" />
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="form-select rounded-lg border-gray-300 text-sm
                   focus:border-gray-900 focus:ring-gray-900"
        >
          <option value="">Seleccionar día festivo</option>
          {HOLIDAYS.map((holiday) => (
            <option key={holiday.date} value={holiday.date}>
              {formatDate(holiday.date)} - {holiday.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleExport}
        disabled={!selectedDate || loading}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm 
                 font-medium rounded-lg text-white bg-gradient-subtle 
                 hover:bg-gradient-subtle-hover disabled:opacity-50 
                 disabled:cursor-not-allowed transition-all duration-200"
      >
        <FileText className="h-4 w-4 mr-2" />
        {loading ? 'Generando...' : 'Exportar PDF'}
      </button>
    </div>
  );
}