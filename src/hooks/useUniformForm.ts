import { useState } from 'react';
import { FormData } from '../types';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export function useUniformForm() {
  const [formData, setFormData] = useState<FormData & { selectedCategory: string }>({
    firstName: '',
    lastName: '',
    comments: '',
    selectedCategory: '',
  });

  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormDataChange = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleCategorySelect = (categoryId: string) => {
    setFormData(prev => ({ ...prev, selectedCategory: categoryId }));
  };

  const handleItemSelect = (itemId: string, size: string) => {
    setSelectedSizes(prev => ({
      ...prev,
      [itemId]: size,
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error('Por favor, completa todos los campos obligatorios');
      return false;
    }

    const selectedItems = Object.values(selectedSizes).filter(Boolean);
    if (selectedItems.length === 0) {
      toast.error('Por favor, selecciona al menos una prenda');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
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

      if (submissionError) throw submissionError;

      const uniformItems = Object.entries(selectedSizes)
        .filter(([_, size]) => size)
        .map(([itemId, size]) => ({
          request_id: submission.id,
          item_id: itemId,
          size: size,
        }));

      const { error: itemsError } = await supabase
        .from('uniform_items')
        .insert(uniformItems);

      if (itemsError) throw itemsError;

      toast.success('¡Solicitud enviada con éxito!');
      
      // Reset form
      setFormData({ firstName: '', lastName: '', comments: '', selectedCategory: '' });
      setSelectedSizes({});
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error('Error al enviar el formulario. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    selectedSizes,
    isSubmitting,
    handleFormDataChange,
    handleItemSelect,
    handleSubmit,
    handleCategorySelect,
  };
}