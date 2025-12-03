import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cleanPrompt } from '@/utils/imageGeneration';

interface PromptInputProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  label?: string;
  readOnly?: boolean;
  placeholder?: string; // Add placeholder prop
  name?: string;
}

const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  onPromptChange,
  onGenerate,
  isGenerating,
  label,
  readOnly = false,
  placeholder, // Destructure placeholder prop
  name,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onGenerate();
    }
  };

  return (
    <div className="input-section mb-4">
      {label && <h2 className="text-lg font-semibold text-gray-800 mb-2">{label}</h2>}

      <div className="flex gap-2">
        <Input
          type="text"
          value={cleanPrompt(prompt)}
          onChange={(e) => onPromptChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder || "Enter your prompt here..."} // Use provided placeholder or default
          className="flex-1 text-sm h-8"
          disabled={isGenerating}
          readOnly={readOnly}
          name={name}
        />
        <Button
          onClick={onGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="px-4 h-8"
        >
          {isGenerating ? 'Generating...' : 'Generate'}
        </Button>
      </div>
    </div>
  );
};

export default PromptInput;
