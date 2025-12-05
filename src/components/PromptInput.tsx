import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cleanPrompt } from '@/utils/imageGeneration';

interface PromptInputProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onGenerate?: () => void; // Make onGenerate optional
  onEnhance?: () => void; // Add onEnhance prop
  isGenerating: boolean;
  isEnhancing?: boolean; // Add isEnhancing state
  label?: string;
  readOnly?: boolean;
  placeholder?: string; // Add placeholder prop
  name?: string;
}

const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  onPromptChange,
  // onGenerate, // No longer destructured if not used internally
  onEnhance,
  isGenerating,
  isEnhancing = false,
  label,
  readOnly = false,
  placeholder, // Destructure placeholder prop
  name,
}) => {
  // Removed handleKeyPress as internal Generate button is removed

  return (
    <div className="input-section mb-4">
      {label && <h2 className="text-lg font-semibold text-gray-800 mb-2">{label}</h2>}

      <div className="flex gap-2">
        <Input
          type="text"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          // onKeyPress removed
          placeholder={placeholder || "Enter your prompt here..."} // Use provided placeholder or default
          className="flex-1 text-sm h-8"
          disabled={isGenerating || isEnhancing}
          readOnly={readOnly}
          name={name}
        />
        {onEnhance && !readOnly && (
          <Button
            onClick={onEnhance}
            disabled={isGenerating || isEnhancing || !prompt.trim()}
            variant="outline"
            size="sm"
            className="px-3 py-1 text-xs"
          >
            {isEnhancing ? 'Enhancing...' : 'Enhance'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PromptInput;
