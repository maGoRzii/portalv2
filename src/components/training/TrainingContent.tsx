import React from 'react';
import { TrainingMedia } from '../../types/training';

interface TrainingContentProps {
  content: string;
  headerImage?: string;
  media?: TrainingMedia[];
}

export function TrainingContent({ content, headerImage, media }: TrainingContentProps) {
  const processContent = (content: string, media?: TrainingMedia[]) => {
    let processedContent = content;
    
    // Replace media placeholders with actual media elements
    if (media?.length) {
      media.forEach(item => {
        const placeholder = `[media:${item.id}]`;
        const mediaHtml = item.type === 'image' 
          ? `<figure class="my-8">
              <img src="${item.url}" alt="${item.caption || ''}" 
                   class="w-full rounded-lg max-h-[500px] object-contain" />
              ${item.caption ? `<figcaption class="mt-2 text-center text-sm text-gray-600">${item.caption}</figcaption>` : ''}
             </figure>`
          : `<figure class="my-8">
              <video src="${item.url}" controls preload="metadata"
                     class="w-full rounded-lg max-h-[500px]"></video>
              ${item.caption ? `<figcaption class="mt-2 text-center text-sm text-gray-600">${item.caption}</figcaption>` : ''}
             </figure>`;

        processedContent = processedContent.replace(placeholder, mediaHtml);
      });
    }

    // Replace direct URL image placeholders
    const urlImageRegex = /\[img:(https?:\/\/[^\]]+)\]/g;
    processedContent = processedContent.replace(urlImageRegex, (match, url) => {
      return `<figure class="my-8">
                <img src="${url}" alt="" 
                     class="w-full rounded-lg max-h-[500px] object-contain" />
              </figure>`;
    });

    // Replace direct URL video placeholders
    const urlVideoRegex = /\[video:(https?:\/\/[^\]]+)\]/g;
    processedContent = processedContent.replace(urlVideoRegex, (match, url) => {
      return `<figure class="my-8">
                <video src="${url}" controls preload="metadata"
                       class="w-full rounded-lg max-h-[500px]"></video>
              </figure>`;
    });

    return processedContent;
  };

  return (
    <div className="space-y-8">
      {/* Header image */}
      {headerImage && (
        <div className="w-full h-[300px] rounded-lg overflow-hidden">
          <img
            src={headerImage}
            alt="Header"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content with inline media */}
      <div className="prose prose-gray max-w-none">
        <div 
          dangerouslySetInnerHTML={{ 
            __html: processContent(content, media) 
          }} 
        />
      </div>
    </div>
  );
}