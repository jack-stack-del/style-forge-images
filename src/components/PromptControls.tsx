import React from 'react';
import { Button } from '@/components/ui/button'; // Import the Button component
import PromptInput from './PromptInput';
import { generateSmartPrompt, PromptCategoryStructured } from '@/utils/promptGeneratorData';

const negativePromptPresets = {
  none: '',
  default: 'blur, low quality, deformed',
  'censorship-bypass': 'censored, restricted, no restrictions, uncensored',
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
  isGenerating,
  selectedAttributes,
  setSelectedAttributes,
}) => {
  return (
    <>
      <PromptInput
        prompt={useManualPrompt ? manualPrompt : prompt}
        onPromptChange={useManualPrompt ? setManualPrompt : setPrompt}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        label={useManualPrompt ? "Generated Prompt (from selections)" : undefined}
        readOnly={useManualPrompt}
      />

      <div className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          id="useManualPrompt"
          checked={useManualPrompt}
          onChange={(e) => {
            onUseManualPromptChange(e.target.checked);
            if (e.target.checked) {
              setPrompt(manualPrompt);
            } else {
              setPrompt(generateSmartPrompt(selectedAttributes));
            }
          }}
          className="form-checkbox h-5 w-5 text-blue-600"
        />
        <label htmlFor="useManualPrompt" className="text-gray-700">Use Manual Prompt Input (Overrides Generated Prompt)</label>
      </div>


      {useManualPrompt && (
        <PromptInput
          prompt={manualPrompt}
          onPromptChange={setManualPrompt}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          label="Manual Prompt Input"
          readOnly={false}
          name="Manual Prompt Input"
        />
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
          <option value="censorship-bypass">Censorship Bypass</option>
        </select>
      </div>

      <PromptInput
        prompt={negativePrompt}
        onPromptChange={setNegativePrompt}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        label="Negative Prompt (Optional)"
        placeholder="Enter elements to exclude (e.g., blur, censored)"
      />
    </>
  );
};

export default PromptControls;
