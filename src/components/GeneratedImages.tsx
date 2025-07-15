
import React from 'react';
import { GeneratedImage } from '@/types/imageGenerator';

interface GeneratedImagesProps {
  images: GeneratedImage[];
  isGenerating: boolean;
}

const GeneratedImages: React.FC<GeneratedImagesProps> = ({ images, isGenerating }) => {
  if (isGenerating) {
    return (
      <div className="text-center py-20 text-muted-foreground text-lg font-medium">
        <div className="inline-block w-8 h-8 border-[3px] border-border border-t-muted-foreground rounded-full animate-spin mb-4"></div>
        <div>Generating images...</div>
      </div>
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-[50px] min-h-[200px]">
      {images.map((image, index) => (
        <div key={index} className="flex flex-col items-center max-w-[512px] w-full">
          <img
            src={image.url}
            alt={`Generated image for ${image.modelName}`}
            className="w-full h-auto rounded-2xl border border-border shadow-lg hover:-translate-y-[2px] transition-transform duration-300"
            loading="lazy"
            style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)' }}
          />
          <div className="mt-4 text-sm text-muted-foreground font-semibold text-center">
            {image.modelName}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GeneratedImages;
