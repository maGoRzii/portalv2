import { useState } from 'react';
import { FormData } from '../types';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { handleSupabaseError } from '../utils/error';

export function useUniformForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    comments: '',
  });

  const [selectedItems, setSelectedItems] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormDataChange = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleItemSelect = (itemId: string, size: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: size,
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error('Por favor, completa todos los campos obligatorios');
      return false;
    }

    const selectedSizes = Object.values(selectedItems).filter(Boolean);
    if (selectedSizes.length === 0) {
      toast.error('Por favor, selecciona al menos una prenda');
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
      const { data: submission, error: submissionError } = await supabase
        .from('uniform_requests')
        .insert({
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
        })
        .select()
        .single();

      if (submissionError) {
        handleSupabaseError(submissionError);
      }

      if (!submission) {
        throw new Error('No se recibió respuesta del servidor');
      }

      const uniformItems = Object.entries(selectedItems)
        .filter(([_, size]) => size)
        .map(([itemId, size]) => ({
          request_id: submission.id,
          item_id: itemId,
          size: size,
        }));

      const { error: itemsError } = await supabase
        .from('uniform_items')
        .insert(uniformItems);

      if (itemsError) {
        handleSupabaseError(itemsError);
      }

      toast.success('¡Solicitud enviada con éxito!');
      
      // Reset form
      setFormData({ firstName: '', lastName: '', comments: '' });
      setSelectedItems({});
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'Error al enviar el formulario. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    selectedItems,
    isSubmitting,
    handleFormDataChange,
    handleItemSelect,
    handleSubmit,
  };
}