// In a new file: `src/components/ModeToggle.tsx`
import React from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon, Edit } from 'lucide-react';

type Mode = 'generate' | 'edit';

interface ModeToggleProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onModeChange }) => {
  return (
    <div className="flex justify-center mb-6">
      <div className="bg-gray-100 p-1 rounded-lg">
        <Button
          variant={mode === 'generate' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onModeChange('generate')}
          className="px-4"
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Generate Image
        </Button>
        <Button
          variant={mode === 'edit' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onModeChange('edit')}
          className="px-4"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Image
        </Button>
      </div>
    </div>
  );
};

export default ModeToggle;
