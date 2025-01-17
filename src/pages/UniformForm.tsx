import React from 'react';
import { Shirt } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { UNIFORM_DATA } from '../data/uniforms';
import { PersonalInfo } from '../components/PersonalInfo';
import { UniformModal } from '../components/uniforms/UniformModal';
import { useUniformForm } from '../hooks/useUniformForm';
import { AdminLoginButton } from '../components/AdminLoginButton';
import { BackButton } from '../components/BackButton';

export function UniformForm() {
  const {
    formData,
    selectedSizes,
    isSubmitting,
    handleFormDataChange,
    handleItemSelect,
    handleSubmit,
    handleCategorySelect,
  } = useUniformForm();

  const selectedCategory = UNIFORM_DATA.find(c => c.id === formData.selectedCategory);

  return (
    <div className="min-h-screen bg-white py-8 px-4 relative">
      <Toaster position="top-center" />
      <BackButton />
      <AdminLoginButton />
      
      <div className="max-w-2xl mx-auto bg-gradient-to-b from-white to-gray-50 rounded-lg border border-gray-200 p-8 mt-16">
        <h1 className="text-3xl font-light text-gray-900 mb-8 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-subtle">
            <Shirt className="h-6 w-6 text-white stroke-[1.5]" />
          </div>
          <span>Solicitud de Uniforme</span>
        </h1>

        <div className="space-y-8">
          <PersonalInfo 
            formData={formData}
            onChange={handleFormDataChange}
          />

          <div className="grid grid-cols-2 gap-4">
            {UNIFORM_DATA.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className="p-6 text-center rounded-lg border border-gray-200 hover:border-blue-500 
                         hover:shadow-md transition-all duration-200"
              >
                <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                <p className="mt-2 text-sm text-gray-500">
                  {category.items.length} artículos disponibles
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedCategory && (
        <UniformModal
          category={selectedCategory}
          selectedSizes={selectedSizes}
          onItemSelect={handleItemSelect}
          onClose={() => handleCategorySelect('')}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}