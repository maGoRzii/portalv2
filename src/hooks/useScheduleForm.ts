import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FormData } from '../types';
import { supabase } from '../lib/supabase';
import { handleSupabaseError } from '../utils/error';

export function useScheduleForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    comments: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormDataChange = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.comments.trim()) {
      toast.error('Por favor, completa todos los campos');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('schedule_changes')
        .insert({
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          message: formData.comments.trim(),
        });

      if (error) {
        handleSupabaseError(error);
      }

      toast.success('¡Solicitud enviada con éxito!');
      setFormData({ firstName: '', lastName: '', comments: '' });
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'Error al enviar el formulario. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    handleFormDataChange,
    handleSubmit,
  };
}