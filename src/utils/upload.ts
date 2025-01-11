import { supabase } from '../lib/supabase';

function sanitizeFilename(filename: string): string {
  // Remove special characters and spaces, keep extension
  const name = filename.replace(/[^a-z0-9.]/gi, '-').toLowerCase();
  return name.replace(/[-]+/g, '-'); // Replace multiple dashes with single dash
}

export async function uploadTrainingFile(file: File, folder: string): Promise<string> {
  const timestamp = Date.now();
  const sanitizedName = sanitizeFilename(file.name);
  const path = `training/${folder}/${timestamp}-${sanitizedName}`;

  const { data, error } = await supabase.storage
    .from('attachments')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('attachments')
    .getPublicUrl(data.path);

  return publicUrl;
}