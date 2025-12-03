
import React, { useState } from 'react';
import PromptControls from './PromptControls';
import ModelsManager from './ModelsManager';
import GeneratedImages from './GeneratedImages';
import AttributeSelector from './AttributeSelector';
import MultiAttributeSelector from './MultiAttributeSelector';
import { promptCategories, PromptCategoryStructured } from '@/utils/promptGeneratorData';
import ModeToggle from './ModeToggle';
import { GeneratedImage } from '@/types/imageGenerator';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useImageGeneration } from '@/hooks/useImageGeneration';

const ImageGenerator: React.FC = () => {
  const [enableCoPilot, setEnableCoPilot] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');

  const {
    prompt,
    setPrompt,
    models,
    setModels,
    images,
    isGenerating,
    selectedAttributes,
    setSelectedAttributes,
    manualPrompt,
    setManualPrompt,
    useManualPrompt,
    setUseManualPrompt,
    negativePrompt,
    setNegativePrompt,
    uploadedImage,
    setUploadedImage,
    img2imgStrength,
    setImg2imgStrength,
    handleGenerate,
    likedImage,
    setLikedImage,
    generationError,
    handleGenerateVariations,
  } = useImageGeneration({ promptCategories, enableCoPilot, geminiApiKey });

  const [mode, setMode] = useState<'generate' | 'edit'>('generate'); // Add state for mode
  const availableModels = models.filter(model => model.capabilities.includes(mode === 'generate' ? 'text-to-image' : 'image-to-image'));

  const handleLikeImage = (image: GeneratedImage) => {
    if (image.prompt && image.seed && image.url) {
      setLikedImage({
        prompt: image.prompt,
        seed: image.seed,
        imageUrl: image.url,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-5 px-5">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          AI Image Generator
        </h1>

        {/* Add the Mode Toggle */}
        <ModeToggle mode={mode} onModeChange={setMode} />

        {/* Prompt Co-Pilot Controls */}
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            id="enable-copilot"
            checked={enableCoPilot}
            onChange={(e) => setEnableCoPilot(e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <Label htmlFor="enable-copilot" className="text-sm font-medium text-gray-700">
            Enable Prompt Co-Pilot (Requires API Key - You have been given this, add freely)
          </Label>
        </div>

        {enableCoPilot && (
          <div className="mb-4">
            <Label htmlFor="gemini-api-key" className="block text-sm font-medium text-gray-700 mb-2">
              Gemini API Key
            </Label>
            <Input
              id="gemini-api-key"
              type="text"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="Paste your Gemini API key here"
              className="mt-1 block w-full"
            />
          </div>
        )}

        <PromptControls
          prompt={prompt}
          setPrompt={setPrompt}
          manualPrompt={manualPrompt}
          setManualPrompt={setManualPrompt}
          useManualPrompt={useManualPrompt}
          onUseManualPromptChange={setUseManualPrompt}
          negativePrompt={negativePrompt}
          setNegativePrompt={setNegativePrompt}
          handleGenerate={handleGenerate}
          isGenerating={isGenerating}
          selectedAttributes={selectedAttributes}
          setSelectedAttributes={setSelectedAttributes}
        />

        {/* --- Image Uploader --- */}
        {/* Only show the uploader in 'edit' mode */}
        {mode === 'edit' && (
          <div className="image-upload-section mb-4 p-3 bg-gray-50 rounded-lg">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Image-to-Image (Optional)</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setUploadedImage(reader.result as string); // Store as Base64
                  };
                  reader.readAsDataURL(file);
                } else {
                  setUploadedImage(null);
                }
              }}
              className="mb-2 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {uploadedImage && (
              <div className="mt-2 flex items-center gap-4">
                <img src={uploadedImage} alt="Uploaded" className="max-w-[100px] max-h-[100px] rounded-md object-cover" />
                <div className="flex-1">
                  <label htmlFor="img2imgStrength" className="block text-sm font-medium text-gray-700">
                    Image Strength (ControlNet / Img2Img)
                  </label>
                  <input
                    type="range"
                    id="img2imgStrength"
                    min="0"
                    max="1"
                    step="0.05"
                    value={img2imgStrength}
                    onChange={(e) => setImg2imgStrength(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-500">Strength: {img2imgStrength.toFixed(2)}</span>
                  <Button 
                    onClick={() => setUploadedImage(null)} 
                    variant="destructive" 
                    size="sm" 
                    className="ml-4 h-7 text-xs"
                  >
                    Remove Image
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- Attribute Selectors --- */}
        {/* Only show the detailed attribute selectors in 'generate' mode for a cleaner UI */}
        {mode === 'generate' && promptCategories.map((category: PromptCategoryStructured) => {
          const currentSelections = (selectedAttributes[category.label] || []) as (string | object)[]; // Allow object types

          // Map options to their 'name' property for display in selectors
          const optionsForDisplay = category.options.map(opt => (typeof opt === 'object' && 'name' in opt) ? opt.name : String(opt));
          
          if (category.multiSelect) {
            return (
              <MultiAttributeSelector
                key={category.label}
                label={category.label}
                options={optionsForDisplay}
                selectedOptions={currentSelections.map(s => ((typeof s === 'object' && 'name' in s) ? s.name : String(s)) as string)}
                onSelect={(optionName) =>
                  setSelectedAttributes((prev) => {
                    const selectedCategoryOption = category.options.find(opt => (typeof opt === 'object' && 'name' in opt) ? opt.name === optionName : String(opt) === optionName);
                    if (!selectedCategoryOption) return prev;

                    const prevSelections = (prev[category.label] || []) as (string | object)[];
                    // Check if an object with the same 'name' is already selected
                    const isSelected = prevSelections.some(item => (typeof item === 'object' && 'name' in item) ? item.name === optionName : String(item) === optionName);

                    if (isSelected) {
                      return { ...prev, [category.label]: prevSelections.filter(item => (typeof item === 'object' && 'name' in item) ? item.name !== optionName : String(item) !== optionName) };
                    } else {
                      return { ...prev, [category.label]: [...prevSelections, selectedCategoryOption] };
                    }
                  })
                }
              />
            );
          } else {
            return (
              <AttributeSelector
                key={category.label}
                label={category.label}
                options={optionsForDisplay}
                selectedOption={(selectedAttributes[category.label] && typeof selectedAttributes[category.label] === 'object' && 'name' in selectedAttributes[category.label]) ? selectedAttributes[category.label].name : selectedAttributes[category.label] as string}
                onSelect={(optionName) => {
                  const selectedCategoryOption = category.options.find(opt => (typeof opt === 'object' && 'name' in opt) ? opt.name === optionName : String(opt) === optionName);
                  if (selectedCategoryOption) {
                    setSelectedAttributes((prev) => ({ ...prev, [category.label]: selectedCategoryOption }));
                  }
                }}
              />
            );
          }
        })}

        {/* Unified Generate button for attribute selectors */}
        {mode === 'generate' && (
          <div className="flex justify-center mt-6 mb-8">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="px-8 py-2 text-base"
            >
              {isGenerating ? 'Generating...' : 'Generate Images'}
            </Button>
          </div>
        )}

        {/* --- Model Manager --- */}
        {/* Always show the model manager, but use the filtered list of available models */}
        <ModelsManager
          models={models}
          onModelsChange={setModels}
          selectedAttributes={selectedAttributes}
        />

        <GeneratedImages
          images={images}
          isGenerating={isGenerating}
          likedImage={likedImage}
          onLikeImage={handleLikeImage}
          onGenerateVariations={handleGenerateVariations}
          generationError={generationError}
        />
      </div>
    </div>
  );
};

export default ImageGenerator;
