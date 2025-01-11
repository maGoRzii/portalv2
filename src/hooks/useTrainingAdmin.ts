import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { TrainingEntryFormData } from '../types/training';
import { toast } from 'react-hot-toast';
import { uploadTrainingFile } from '../utils/upload';

export function useTrainingAdmin(groupId: string) {
  const [loading, setLoading] = useState(false);

  const createEntry = async (data: TrainingEntryFormData) => {
    setLoading(true);
    try {
      const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Upload header image if provided
      let headerImageUrl = undefined;
      if (data.headerImage) {
        headerImageUrl = await uploadTrainingFile(data.headerImage, `${groupId}/headers`);
      }

      // Create entry
      const { data: entry, error: entryError } = await supabase
        .from('training_entries')
        .insert({
          group_id: groupId,
          title: data.title,
          slug,
          content: data.content,
          header_image: headerImageUrl,
          published: data.published,
        })
        .select()
        .single();

      if (entryError) throw entryError;

      // Upload media files if any
      if (data.media && data.media.length > 0) {
        const mediaPromises = data.media.map(async (file) => {
          const url = await uploadTrainingFile(file, entry.id);
          
          return supabase
            .from('training_media')
            .insert({
              entry_id: entry.id,
              type: file.type.startsWith('image/') ? 'image' : 'video',
              url,
              caption: data.mediaCaptions?.[file.name] || null,
            });
        });

        await Promise.all(mediaPromises);
      }

      toast.success('Entrada creada correctamente');
      return true;
    } catch (error) {
      console.error('Error creating entry:', error);
      toast.error('Error al crear la entrada');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateEntry = async (
    entryId: string,
    data: TrainingEntryFormData
  ) => {
    setLoading(true);
    try {
      const updates: any = {
        title: data.title,
        content: data.content,
        published: data.published,
      };

      if (data.title) {
        updates.slug = data.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }

      // Upload new header image if provided
      if (data.headerImage) {
        updates.header_image = await uploadTrainingFile(data.headerImage, `${groupId}/headers`);
      }

      const { error: entryError } = await supabase
        .from('training_entries')
        .update(updates)
        .eq('id', entryId);

      if (entryError) throw entryError;

      // Upload new media files if any
      if (data.media && data.media.length > 0) {
        const mediaPromises = data.media.map(async (file) => {
          const url = await uploadTrainingFile(file, entryId);
          
          return supabase
            .from('training_media')
            .insert({
              entry_id: entryId,
              type: file.type.startsWith('image/') ? 'image' : 'video',
              url,
              caption: data.mediaCaptions?.[file.name] || null,
            });
        });

        await Promise.all(mediaPromises);
      }

      toast.success('Entrada actualizada correctamente');
      return true;
    } catch (error) {
      console.error('Error updating entry:', error);
      toast.error('Error al actualizar la entrada');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (entryId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('training_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;
      toast.success('Entrada eliminada correctamente');
      return true;
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('Error al eliminar la entrada');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createEntry,
    updateEntry,
    deleteEntry,
  };
}