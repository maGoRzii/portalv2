import React, { useState } from 'react';
import { Image, Video } from 'lucide-react';
import { TrainingEntry, TrainingEntryFormData } from '../../../types/training';
import { FileUpload } from '../../FileUpload';

interface TrainingEntryFormProps {
  initialData?: TrainingEntry;
  onSubmit: (data: TrainingEntryFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function TrainingEntryForm({
  initialData,
  onSubmit,
  onCancel,
  loading
}: TrainingEntryFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [published, setPublished] = useState(initialData?.published || false);
  const [headerImage, setHeaderImage] = useState<File | null>(null);
  const [media, setMedia] = useState<File[]>([]);
  const [mediaCaptions, setMediaCaptions] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title,
      content,
      published,
      headerImage: headerImage || undefined,
      media,
      mediaCaptions
    });
  };

  const handleHeaderImageSelect = (files: File[]) => {
    if (files.length > 0) {
      setHeaderImage(files[0]);
    }
  };

  const handleMediaSelect = (files: File[]) => {
    setMedia(prev => [...prev, ...files]);
    files.forEach(file => {
      setMediaCaptions(prev => ({
        ...prev,
        [file.name]: ''
      }));
    });
  };

  const handleMediaRemove = (index: number) => {
    const removedFile = media[index];
    setMedia(prev => prev.filter((_, i) => i !== index));
    setMediaCaptions(prev => {
      const newCaptions = { ...prev };
      delete newCaptions[removedFile.name];
      return newCaptions;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Título
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                   focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Imagen de cabecera
        </label>
        <FileUpload
          onFilesSelected={handleHeaderImageSelect}
          selectedFiles={headerImage ? [headerImage] : []}
          onFileRemove={() => setHeaderImage(null)}
          accept="image/*"
          maxFiles={1}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Contenido
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={10}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                   focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imágenes y vídeos
        </label>
        <FileUpload
          onFilesSelected={handleMediaSelect}
          selectedFiles={media}
          onFileRemove={handleMediaRemove}
          accept="image/*,video/*"
        />
        {media.length > 0 && (
          <div className="mt-4 space-y-4">
            {media.map((file, index) => (
              <div key={index} className="flex items-start gap-4">
                {file.type.startsWith('image/') ? (
                  <Image className="h-5 w-5 text-gray-500" />
                ) : (
                  <Video className="h-5 w-5 text-gray-500" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{file.name}</p>
                  <input
                    type="text"
                    value={mediaCaptions[file.name] || ''}
                    onChange={(e) => setMediaCaptions(prev => ({
                      ...prev,
                      [file.name]: e.target.value
                    }))}
                    placeholder="Añadir pie de foto/vídeo (opcional)"
                    className="mt-1 block w-full text-sm rounded-md border-gray-300
                             focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 
                   focus:ring-blue-500"
        />
        <label className="ml-2 block text-sm text-gray-900">
          Publicar entrada
        </label>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm
                   font-medium text-gray-700 bg-white hover:bg-gray-50
                   focus:outline-none focus:ring-2 focus:ring-offset-2
                   focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm
                   text-sm font-medium text-white bg-blue-600 hover:bg-blue-700
                   focus:outline-none focus:ring-2 focus:ring-offset-2
                   focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
}