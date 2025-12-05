import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'; // Import the Button component
import PromptInput from './PromptInput';
import ApiKeyDialog from './ApiKeyDialog';
import { generateSmartPrompt, PromptCategoryStructured } from '@/utils/promptGeneratorData';

const negativePromptPresets = {
  none: '',
  default: 'blur, low quality, deformed, censored, restricted, pixelated, bad art, disfigured, poor quality, lowres, watermark, bad anatomy, bad hands, bad proportions, ugly, mutilated, extra limbs, face cut, head cut, body cut, worst quality, normal quality, blurry, jpeg artifacts, signature, text, error, compression artifacts, noise, grain', // Comprehensive quality controls for general image generation
  'high-quality': 'lowres, low quality, worst quality, normal quality, blurry, pixelated, jpeg artifacts, bad anatomy, bad hands, bad proportions, deformed, ugly, mutilated, disfigured, watermark, signature, text, error, compression artifacts, noise, grain, extra limbs, face cut, head cut, body cut', // Maximum quality preset for professional use
  'anime-style': 'realistic, photorealistic, photograph, 3d render, cgi, deformed, ugly, mutilated, disfigured, watermark, signature, text, error, low quality, blurry, jpeg artifacts, realistic skin, realistic eyes, realistic hair', // Prevents realistic elements in anime generation
  'censorship-bypass': 'censored, restricted, blurry, pixelated, low quality, watermark, text, error, deformed, ugly, mutilated, disfigured, mutation, extra limbs, fused fingers, too many fingers, missing limbs, floating limbs, disconnected limbs, malformed hands, malformed arms, malformed legs, strange limbs, strange body, malformed face, distorted face, asymmetric face, lowres, bad anatomy, bad proportions, jpeg artifacts, compression artifacts, noise, grain, cartoon, animated, sketch, painting, drawing, illustration, 3d render, cgi, doll, toy, mosaic, bars, black bars, blurred genitals', // Comprehensive research-based negative prompt for realistic uncensored NSFW images
};

interface PromptControlsProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  manualPrompt: string;
  setManualPrompt: (prompt: string) => void;
  useManualPrompt: boolean;
  onUseManualPromptChange: (useManual: boolean) => void;
  negativePrompt: string;
  setNegativePrompt: (prompt: string) => void;
  handleGenerate: () => void;
  handleGenerateWithAllModels?: () => void;
  isGenerating: boolean;
  selectedAttributes: Record<string, string | string[]>;
  setSelectedAttributes: (attrs: Record<string, string | string[]>) => void;
}

const PromptControls: React.FC<PromptControlsProps> = ({
  prompt,
  setPrompt,
  manualPrompt,
  setManualPrompt,
  useManualPrompt,
  onUseManualPromptChange,
  negativePrompt,
  setNegativePrompt,
  handleGenerate,
  handleGenerateWithAllModels,
  isGenerating,
  selectedAttributes,
  setSelectedAttributes,
}) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [storedApiKey, setStoredApiKey] = useState<string | null>(null);

  // Check for stored API key on component mount
  useEffect(() => {
    const key = sessionStorage.getItem('openrouter_api_key');
    if (key) {
      setStoredApiKey(key);
    }
  }, []);

  const handleEnhance = async () => {
    if (!manualPrompt.trim()) return;

    // Check if we have an API key
    if (!storedApiKey) {
      setShowApiKeyDialog(true);
      return;
    }

    setIsEnhancing(true);
    try {
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: manualPrompt,
          apiKey: storedApiKey
        }),
      });

      const data = await response.json();

      if (response.ok && data.enhancedPrompt) {
        setManualPrompt(data.enhancedPrompt);
      } else {
        alert(`Enhancement failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Enhancement error:', error);
      // Check if it's a network error (backend not available)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        alert('Prompt enhancement is not available in the online version. This feature requires a local server setup.');
      } else {
        alert('Failed to enhance prompt. Please try again.');
      }
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleApiKeySave = (apiKey: string) => {
    sessionStorage.setItem('openrouter_api_key', apiKey);
    setStoredApiKey(apiKey);
  };

  const handleForgetApiKey = () => {
    sessionStorage.removeItem('openrouter_api_key');
    setStoredApiKey(null);
  };
  return (
    <>
        <PromptInput
          prompt={useManualPrompt ? manualPrompt : prompt}
          onPromptChange={useManualPrompt ? setManualPrompt : setPrompt}
          // onGenerate removed
          isGenerating={isGenerating}
          label={useManualPrompt ? "Generated Prompt (from selections)" : undefined}
          readOnly={useManualPrompt}
        />

        <div className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            id="useManualPrompt"
            checked={useManualPrompt}
            onChange={(e) => onUseManualPromptChange(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <label htmlFor="useManualPrompt" className="text-gray-700">Use Manual Prompt Input (Overrides Generated Prompt)</label>
        </div>

        {useManualPrompt && (
          <>
            <PromptInput
              prompt={manualPrompt}
              onPromptChange={setManualPrompt}
              onEnhance={handleEnhance}
              isGenerating={isGenerating}
              isEnhancing={isEnhancing}
              label="Manual Prompt Input"
              readOnly={false}
              name="Manual Prompt Input"
            />
            {storedApiKey && (
              <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800 flex items-center justify-between">
                <span>✓ OpenRouter API key configured (session)</span>
                <Button
                  onClick={handleForgetApiKey}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Forget Key
                </Button>
              </div>
            )}
          </>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Negative Prompt Preset</label>
          <select
            onChange={(e) => {
              const value = negativePromptPresets[e.target.value as keyof typeof negativePromptPresets];
              if (value !== undefined) {
                setNegativePrompt(value);
              }
            }}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="none">None</option>
            <option value="default">Default</option>
            <option value="high-quality">High Quality</option>
            <option value="anime-style">Anime Style</option>
            <option value="censorship-bypass">Censorship Bypass</option>
          </select>
        </div>

        <PromptInput
          prompt={negativePrompt}
          onPromptChange={setNegativePrompt}
          // onGenerate removed
          isGenerating={isGenerating}
          label="Negative Prompt (Optional)"
          placeholder="Enter elements to exclude (e.g., blur, censored)"
        />

        {/* Generate buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="px-6 py-2 text-base"
            variant="outline"
          >
            {isGenerating ? 'Generating...' : 'Generate (6 Models)'}
          </Button>
          {handleGenerateWithAllModels && (
            <Button
              onClick={handleGenerateWithAllModels}
              disabled={isGenerating || !prompt.trim()}
              className="px-6 py-2 text-base bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              {isGenerating ? 'Generating...' : 'Generate with All Models'}
            </Button>
          )}
        </div>

        <ApiKeyDialog
          isOpen={showApiKeyDialog}
          onClose={() => setShowApiKeyDialog(false)}
          onSave={handleApiKeySave}
        />
    </>
  );
};

export default PromptControls;
