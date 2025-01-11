import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { PersonalInfo } from '../PersonalInfo';
import { Comments } from '../Comments';
import { FileUpload } from '../FileUpload';
import { RequestTypeSelect } from './RequestTypeSelect';
import { ClockCardOptions } from './ClockCardOptions';
import { useRequestForm } from '../../hooks/useRequestForm';

export function RequestForm() {
  const { formData, isSubmitting, handleFormDataChange, handleSubmit, handleFilesChange } = useRequestForm();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
    handleFilesChange([...selectedFiles, ...files]);
  };

  const handleFileRemove = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    handleFilesChange(newFiles);
  };

  return (
    <div className="max-w-2xl mx-auto bg-gradient-to-b from-white to-gray-50 rounded-lg border border-gray-200 p-8 mt-16">
      <h1 className="text-3xl font-light text-gray-900 mb-8 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-subtle">
          <FileText className="h-6 w-6 text-white stroke-[1.5]" />
        </div>
        <span>Nueva Petición</span>
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <PersonalInfo 
          formData={formData}
          onChange={handleFormDataChange}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Petición <span className="text-red-500">*</span>
          </label>
          <RequestTypeSelect
            value={formData.type || ''}
            onChange={(type) => handleFormDataChange({ type })}
          />
        </div>
        
        {formData.type === 'clock_card' ? (
          <ClockCardOptions
            value={formData.clockCardOption}
            onChange={(option) => handleFormDataChange({ clockCardOption: option })}
          />
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detalles de la petición (opcional)
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => handleFormDataChange({ message: e.target.value })}
              placeholder="Describe tu petición..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 
                       focus:ring-purple-500 transition-colors duration-200 bg-white/50 min-h-[120px]"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Archivos adjuntos (opcional)
          </label>
          <FileUpload 
            onFilesSelected={handleFileSelect}
            selectedFiles={selectedFiles}
            onFileRemove={handleFileRemove}
            disabled={isSubmitting} 
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-6 rounded-lg font-medium text-white
                   bg-gradient-subtle hover:bg-gradient-subtle-hover
                   transition-all duration-200 focus:outline-none focus:ring-2 
                   focus:ring-gray-900 focus:ring-offset-2
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Petición'}
        </button>
      </form>
    </div>
  );
}