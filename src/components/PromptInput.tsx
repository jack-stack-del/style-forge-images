
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PromptInputProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  onPromptChange,
  onGenerate,
  isGenerating
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onGenerate();
    }
  };

  return (
    <div className="input-section mb-8">
      <div className="flex gap-3">
        <Input
          type="text"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your prompt (e.g., a cat wearing sunglasses)"
          className="flex-1 text-base"
          disabled={isGenerating}
        />
        <Button 
          onClick={onGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="px-6"
        >
          {isGenerating ? 'Generating...' : 'Generate'}
        </Button>
      </div>
    </div>
  );
};

export default PromptInput;
