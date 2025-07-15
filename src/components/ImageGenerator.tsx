
import React, { useState } from 'react';
import PromptInput from './PromptInput';
import FloatingModelsPanel from './FloatingModelsPanel';
import GeneratedImages from './GeneratedImages';
import { Model, GeneratedImage } from '@/types/imageGenerator';
import { generateImageUrl, getInitialModels } from '@/utils/imageGeneration';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [models, setModels] = useState<Model[]>(getInitialModels());
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setImages([]);

    const generatedImages: GeneratedImage[] = models.map(model => ({
      url: generateImageUrl(prompt, model),
      modelName: model.name,
      prompt: prompt
    }));

    // Simulate loading time
    setTimeout(() => {
      setImages(generatedImages);
      setIsGenerating(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto py-10 px-5 relative">
        <div className="text-center mb-[50px]">
          <h1 className="text-[32px] font-bold text-foreground mb-2 tracking-tight">
            AI Image Generator
          </h1>
          <p className="text-muted-foreground text-base">
            Create stunning images with artificial intelligence
          </p>
        </div>
        
        <PromptInput
          prompt={prompt}
          onPromptChange={setPrompt}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />

        <GeneratedImages
          images={images}
          isGenerating={isGenerating}
        />

        <FloatingModelsPanel
          models={models}
          onModelsChange={setModels}
        />
      </div>
    </div>
  );
};

export default ImageGenerator;
