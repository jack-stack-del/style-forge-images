import React, { memo, useCallback, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Loader2, AlertCircle, Copy } from 'lucide-react';
import { GeneratedImage } from '@/types/imageGenerator'; // Use GeneratedImage
import VirtualizedImageGrid from './VirtualizedImageGrid';
import { ImageModal } from './ImageModal'; // Import ImageModal

interface GeneratedImagesProps {
  images: GeneratedImage[];
  isGenerating: boolean;
  likedImage: { prompt: string; seed: string; imageUrl: string } | null;
  onLikeImage: (image: GeneratedImage) => void;
  onGenerateVariations: () => void;
  generationError: string | null;
}

const GeneratedImages: React.FC<GeneratedImagesProps> = memo(({
  images,
  isGenerating,
  likedImage,
  onLikeImage,
  onGenerateVariations,
  generationError,
}) => {
  const [modalImage, setModalImage] = useState<string | null>(null); // State for ImageModal

  const handleCopyPrompt = useCallback(async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
    } catch (err) {
      console.error('Failed to copy prompt:', err);
    }
  }, []);

  const openModal = useCallback((imageUrl: string) => {
    setModalImage(imageUrl);
  }, []);

  const closeModal = useCallback(() => {
    setModalImage(null);
  }, []);

  // Simple loading skeleton
  if (isGenerating && images.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-300 rounded-lg h-64 w-full"></div>
            <div className="h-4 bg-gray-300 rounded mt-2 w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded mt-2 w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  // Failed state
  if (generationError) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Generation Failed</h2>
        <p className="text-gray-600">{generationError}</p>
      </div>
    );
  }

  // No images and not generating
  if (!isGenerating && images.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No images generated yet. Adjust your prompt and try again!
      </div>
    );
  }

  return (
    <>
      <div>
        {/* Show "Generate Variations" button if an image is liked */}
        {likedImage && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-sm text-blue-700 mb-2">
              Generating variations for your liked image with prompt: <strong>{likedImage.prompt}</strong>
            </p>
            <Button onClick={onGenerateVariations} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Generate 8 New Variations
            </Button>
          </div>
        )}

        <VirtualizedImageGrid
          images={images}
          isGenerating={isGenerating}
          likedImage={likedImage}
          onLikeImage={onLikeImage}
          onCopyPrompt={handleCopyPrompt}
          onImageClick={openModal} // Pass the new click handler
          containerHeight={600}
        />
      </div>

      {/* Full-view modal using ImageModal component */}
      <ImageModal
        imageUrl={modalImage || ''}
        isOpen={!!modalImage}
        onClose={closeModal}
      />
    </>
  );
});

GeneratedImages.displayName = 'GeneratedImages';

export default GeneratedImages;
