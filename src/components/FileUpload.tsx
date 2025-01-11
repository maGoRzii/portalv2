import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  selectedFiles: File[];
  onFileRemove: (index: number) => void;
  disabled?: boolean;
}

export function FileUpload({ onFilesSelected, selectedFiles, onFileRemove, disabled }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onFilesSelected(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        className="hidden"
        multiple
        accept="image/*,.pdf,.doc,.docx"
        disabled={disabled}
      />
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg
                 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
                 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Upload className="h-4 w-4 mr-2" />
        Adjuntar archivos
      </button>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Archivos seleccionados:</p>
          <ul className="space-y-2">
            {selectedFiles.map((file, index) => (
              <li key={index} className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                <span className="truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => onFileRemove(index)}
                  className="ml-2 text-gray-500 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}