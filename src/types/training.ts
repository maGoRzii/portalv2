import { User } from '@supabase/supabase-js';

export interface TrainingGroup {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface TrainingEntry {
  id: string;
  group_id: string;
  title: string;
  slug: string;
  content: string;
  header_image?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface TrainingMedia {
  id: string;
  entry_id: string;
  type: 'image' | 'video';
  url: string;
  caption: string | null;
  created_at: string;
}

export interface TrainingEntryFormData {
  title: string;
  content: string;
  published: boolean;
  headerImage?: File;
  media?: File[];
  mediaCaptions?: Record<string, string>;
}