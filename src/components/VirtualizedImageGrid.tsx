import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Copy, Loader2 } from 'lucide-react';
import { GeneratedImage } from '@/types/imageGenerator'; // Use GeneratedImage

interface VirtualizedImageGridProps {
  images: GeneratedImage[]; // Use GeneratedImage
  isGenerating: boolean;
  likedImage: { prompt: string; seed: string; imageUrl: string } | null;
  onLikeImage: (image: GeneratedImage) => void; // Use GeneratedImage
  onCopyPrompt: (prompt: string) => void;
  onImageClick: (imageUrl: string) => void; // Change prop type to imageUrl
  itemHeight?: number;
  itemsPerRow?: number;
  containerHeight?: number;
}

const VirtualizedImageGrid: React.FC<VirtualizedImageGridProps> = ({
  images,
  isGenerating,
  likedImage,
  onLikeImage,
  onCopyPrompt,
  onImageClick, // Destructure new prop
  itemHeight = 320,
  itemsPerRow = 4,
  containerHeight = 600,
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  // Calculate responsive items per row based on container width
  const calculateItemsPerRow = useCallback((width: number) => {
    if (width >= 1280) return 4; // xl
    if (width >= 1024) return 3; // lg
    if (width >= 768) return 2; // md
    return 1; // sm and below
  }, []);

  useEffect(() => {
    const updateContainerWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    return () => window.removeEventListener('resize', updateContainerWidth);
  }, []);

  useEffect(() => {
    const currentItemsPerRow = calculateItemsPerRow(containerWidth);
    if (currentItemsPerRow !== itemsPerRow) {
      // Could update parent component if needed
    }
  }, [containerWidth, itemsPerRow, calculateItemsPerRow]);

  const currentItemsPerRow = calculateItemsPerRow(containerWidth);
  const rowHeight = itemHeight + 16; // Add gap
  const totalRows = Math.ceil(images.length / currentItemsPerRow);
  const totalHeight = totalRows * rowHeight;

  const startRow = Math.floor(scrollTop / rowHeight);
  const endRow = Math.min(
    startRow + Math.ceil(containerHeight / rowHeight) + 1,
    totalRows
  );

  const visibleImages = images.slice(
    startRow * currentItemsPerRow,
    endRow * currentItemsPerRow
  );

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
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

  // No images and not generating
  if (!isGenerating && images.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No images generated yet. Adjust your prompt and try again!
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-auto border rounded-lg"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div
        ref={scrollElementRef}
        style={{
          height: totalHeight,
          position: 'relative',
        }}
      >
        {Array.from({ length: endRow - startRow }).map((_, rowIndex) => {
          const rowStartIndex = (startRow + rowIndex) * currentItemsPerRow;
          const rowImages = images.slice(
            rowStartIndex,
            rowStartIndex + currentItemsPerRow
          );

          return (
            <div
              key={startRow + rowIndex}
              className="flex gap-4 p-4"
              style={{
                position: 'absolute',
                top: (startRow + rowIndex) * rowHeight,
                left: 0,
                right: 0,
                height: rowHeight,
              }}
            >
              {rowImages.map((image, colIndex) => (
                <div
                  key={image.url}
                  className="flex-1 border rounded-lg overflow-hidden shadow-md cursor-pointer" // Add cursor-pointer
                  style={{
                    maxWidth: `calc(${100 / currentItemsPerRow}% - ${16 * (currentItemsPerRow - 1) / currentItemsPerRow}px)`,
                  }}
                  onClick={() => onImageClick(image.url)} // Pass image.url
                >
                  <img
                    src={image.url}
                    alt={image.prompt}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-2">
                    <p className="text-xs text-gray-600 truncate mb-1">
                      {image.prompt}
                    </p>
                    <p className="text-xs text-gray-400 mb-2">
                      Seed: {image.seed}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-1">
                        <Button
                          onClick={() => onLikeImage(image)}
                          variant={likedImage?.imageUrl === image.url ? "default" : "outline"}
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <Heart className={`h-3 w-3 ${likedImage?.imageUrl === image.url ? 'fill-current' : ''}`} />
                        </Button>
                        <Button
                          onClick={() => onCopyPrompt(image.prompt)}
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VirtualizedImageGrid;
