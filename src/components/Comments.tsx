import React from 'react';
import { MessageSquare } from 'lucide-react';

interface CommentsProps {
  value: string;
  onChange: (value: string) => void;
}

export function Comments({ value, onChange }: CommentsProps) {
  return (
    <div 
      className="animate-slide-in" 
      style={{ opacity: 0, animationDelay: '200ms' }}
    >
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <MessageSquare className="text-purple-600" />
        Comentarios (opcional)
      </label>
      <textarea
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 
                 focus:ring-purple-500 transition-colors duration-200 bg-white/50 min-h-[120px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="¿Algún comentario adicional?"
      />
    </div>
  );
}