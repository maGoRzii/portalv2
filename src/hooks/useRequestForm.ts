import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { RequestFormData, RequestType } from '../types/request';
import { supabase } from '../lib/supabase';
import { handleSupabaseError } from '../utils/error';

export function useRequestForm() {
  const [formData, setFormData] = useState<RequestFormData>({
    firstName: '',
    lastName: '',
    message: '',
    type: '' as RequestType,
    files: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormDataChange = (data: Partial<RequestFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleFilesChange = (files: File[]) => {
    setFormData(prev => ({ ...prev, files }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.type) {
      toast.error('Por favor, completa los campos obligatorios: nombre, apellidos y tipo de petición');
      return false;
    }

    if (formData.type === 'clock_card' && !formData.clockCardOption) {
      toast.error('Por favor, selecciona una opción para la tarjeta de fichar');
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
      const attachments = await Promise.all(
        formData.files.map(async (file) => {
          const { data, error } = await supabase.storage
            .from('attachments')
            .upload(`${Date.now()}-${file.name}`, file);

          if (error) throw error;
          return data.path;
        })
      );

      const requestData = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        type: formData.type,
        message: formData.type === 'clock_card' ? null : (formData.message.trim() || null),
        clock_card_option: formData.type === 'clock_card' ? formData.clockCardOption : null,
        attachments: attachments.length > 0 ? attachments : null,
      };

      const { error } = await supabase
        .from('requests')
        .insert(requestData);

      if (error) {
        handleSupabaseError(error);
      }

      toast.success('¡Petición enviada con éxito!');
      setFormData({ 
        firstName: '', 
        lastName: '', 
        message: '', 
        type: '' as RequestType, 
        files: [] 
      });
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
    handleFilesChange,
    handleSubmit,
  };
}