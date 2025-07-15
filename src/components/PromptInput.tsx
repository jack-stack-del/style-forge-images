
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
    <div className="mb-[60px] flex flex-col items-center gap-5">
      <Input
        type="text"
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Describe the image you want to create..."
        className="w-full max-w-[600px] p-[18px_24px] bg-input border border-border rounded-xl text-foreground text-base placeholder:text-muted-foreground focus:border-ring focus:bg-accent/20 focus:ring-2 focus:ring-ring/20 transition-all duration-300"
        disabled={isGenerating}
      />
      <Button 
        onClick={onGenerate}
        disabled={isGenerating || !prompt.trim()}
        className="py-4 px-10 bg-button-primary border border-button-border rounded-lg text-foreground text-base font-semibold hover:bg-button-primary-hover hover:border-ring hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 min-w-[140px]"
      >
        {isGenerating ? 'Generating...' : 'Generate'}
      </Button>
    </div>
  );
};

export default PromptInput;
