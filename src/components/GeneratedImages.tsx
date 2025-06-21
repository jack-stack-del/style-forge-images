
import React from 'react';
import { GeneratedImage } from '@/types/imageGenerator';

interface GeneratedImagesProps {
  images: GeneratedImage[];
  isGenerating: boolean;
}

const GeneratedImages: React.FC<GeneratedImagesProps> = ({ images, isGenerating }) => {
  if (isGenerating) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600 italic">Generating images...</div>
      </div>
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="images-container space-y-6">
      {images.map((image, index) => (
        <div key={index} className="flex flex-col items-center p-5 border border-gray-200 rounded-lg bg-gray-50">
          <img
            src={image.url}
            alt={`Generated image for ${image.modelName}`}
            className="w-full max-w-lg h-auto rounded-lg shadow-md"
            loading="lazy"
          />
          <div className="mt-3 font-semibold text-gray-800 text-center">
            {image.modelName}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GeneratedImages;
