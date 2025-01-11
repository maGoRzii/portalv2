import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FormData, ShiftPreference } from '../types';
import { HOLIDAYS } from '../data/holidays';
import { supabase } from '../lib/supabase';
import { handleSupabaseError } from '../utils/error';

export function useFormState() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    comments: '',
  });

  const [shifts, setShifts] = useState<ShiftPreference[]>(
    HOLIDAYS.map(holiday => ({
      date: holiday.date,
      selected: false,
      compensation: '',
    }))
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormDataChange = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleShiftChange = (date: string, field: 'selected' | 'compensation', value: any) => {
    setShifts(shifts.map(shift => 
      shift.date === date 
        ? { 
            ...shift, 
            [field]: value,
            ...(field === 'selected' && !value ? { compensation: '' } : {})
          }
        : shift
    ));
  };

  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error('Por favor, completa todos los campos obligatorios');
      return false;
    }

    const selectedShifts = shifts.filter(shift => shift.selected);
    
    if (selectedShifts.length === 0) {
      toast.error('Por favor, selecciona al menos un día festivo');
      return false;
    }

    const invalidShifts = selectedShifts.filter(shift => !shift.compensation);
    if (invalidShifts.length > 0) {
      toast.error('Por favor, selecciona el tipo de compensación para todos los días seleccionados');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const selectedShifts = shifts.filter(shift => shift.selected);
    setIsSubmitting(true);

    try {
      // Start a transaction
      const { data: submission, error: submissionError } = await supabase
        .from('holiday_submissions')
        .insert({
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          comments: formData.comments.trim() || null,
        })
        .select()
        .single();

      if (submissionError) {
        handleSupabaseError(submissionError);
      }

      if (!submission) {
        throw new Error('No se recibió respuesta del servidor');
      }

      // Insert shifts
      const { error: shiftsError } = await supabase
        .from('holiday_shifts')
        .insert(
          selectedShifts.map(shift => ({
            submission_id: submission.id,
            holiday_date: shift.date,
            compensation_type: shift.compensation,
          }))
        );

      if (shiftsError) {
        handleSupabaseError(shiftsError);
      }

      toast.success('¡Formulario enviado con éxito!');
      
      // Reset form
      setFormData({ firstName: '', lastName: '', comments: '' });
      setShifts(HOLIDAYS.map(holiday => ({
        date: holiday.date,
        selected: false,
        compensation: '',
      })));
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'Error al enviar el formulario. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    shifts,
    isSubmitting,
    handleFormDataChange,
    handleShiftChange,
    handleSubmit,
  };
}