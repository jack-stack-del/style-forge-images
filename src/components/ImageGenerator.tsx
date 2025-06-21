
import React, { useState } from 'react';
import PromptInput from './PromptInput';
import ModelsManager from './ModelsManager';
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
    <div className="min-h-screen bg-gray-50 py-5 px-5">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          AI Image Generator
        </h1>
        
        <PromptInput
          prompt={prompt}
          onPromptChange={setPrompt}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />

        <ModelsManager
          models={models}
          onModelsChange={setModels}
        />

        <GeneratedImages
          images={images}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
};

export default ImageGenerator;
