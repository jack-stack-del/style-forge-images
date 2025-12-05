
import React, { useState } from 'react';
import PromptControls from './PromptControls';
import ModelsManager from './ModelsManager';
import GeneratedImages from './GeneratedImages';
import AttributeSelector from './AttributeSelector';
import MultiAttributeSelector from './MultiAttributeSelector';
import { promptCategories, PromptCategoryStructured } from '@/utils/promptGeneratorData';
import { styles } from '@/utils/promptData/styles';

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
    handleGenerate,
    handleGenerateWithAllModels,
    likedImage,
    setLikedImage,
    generationError,
    handleGenerateVariations,
  } = useImageGeneration({ promptCategories, enableCoPilot, geminiApiKey });

  const availableModels = models.filter(model => model.capabilities.includes('text-to-image'));

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

        {isGenerating && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-blue-800 font-medium">Generating images with multiple AI models...</span>
            </div>
            <p className="text-sm text-blue-600 mt-2 text-center">
              This may take 30-60 seconds. Different models will create unique variations of your prompt.
            </p>
          </div>
        )}



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
          handleGenerateWithAllModels={handleGenerateWithAllModels}
          isGenerating={isGenerating}
          selectedAttributes={selectedAttributes}
          setSelectedAttributes={setSelectedAttributes}
        />

        {/* Dynamic Style Selector - PRIORITY FEATURE */}
        <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 shadow-sm">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">🎨</span>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Choose Your Style</h3>
              <p className="text-sm text-gray-600">This defines the visual aesthetic - select first for best results!</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {styles.map((style) => {
              const isSelected = selectedAttributes.Style && typeof selectedAttributes.Style === 'object' && 'name' in selectedAttributes.Style && selectedAttributes.Style.name === style.name;
              return (
                <button
                  key={style.name}
                  onClick={() => setSelectedAttributes((prev) => ({ ...prev, Style: style }))}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                    isSelected
                      ? 'border-blue-500 bg-blue-100 shadow-md transform scale-105'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                  }`}
                >
                  <div className="font-semibold text-sm text-gray-800">{style.name}</div>
                  {style.preferredModel && (
                    <div className="text-xs text-gray-500 mt-1">Best with: {style.preferredModel}</div>
                  )}
                </button>
              );
            })}
          </div>
          {selectedAttributes.Style && typeof selectedAttributes.Style === 'object' && 'name' in selectedAttributes.Style && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-sm font-medium text-blue-800">
                  Selected: {selectedAttributes.Style.name}
                </span>
              </div>
              <div className="text-xs text-blue-600 mt-1">
                Keywords: {selectedAttributes.Style.keywords.join(', ')}
              </div>
            </div>
          )}
        </div>

        {/* --- Attribute Selectors --- */}
        {promptCategories.map((category: PromptCategoryStructured) => {
          const currentSelections = (selectedAttributes[category.label] || []) as (string | object)[]; // Allow object types

          // Map options to their 'name' property for display in selectors
          const optionsForDisplay = category.options.map(opt => (typeof opt === 'object' && 'name' in opt) ? opt.name : String(opt));

          if (category.multiSelect) {
            return (
              <div key={category.label} className="mb-4">
                <MultiAttributeSelector
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
              </div>
            );
          } else {
            return (
              <div key={category.label} className="mb-4">
                <AttributeSelector
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
              </div>
            );
          }
        })}

        {/* Unified Generate button for attribute selectors */}
        <div className="flex justify-center mt-6 mb-8">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="px-8 py-2 text-base"
          >
            {isGenerating ? 'Generating...' : 'Generate Images'}
          </Button>
        </div>

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
