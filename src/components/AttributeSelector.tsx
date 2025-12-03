import React from 'react';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui button

interface AttributeSelectorProps {
  label: string;
  options: string[];
  selectedOption?: string;
  onSelect: (option: string) => void;
}

const AttributeSelector: React.FC<AttributeSelectorProps> = ({
  label,
  options,
  selectedOption,
  onSelect,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">{label}:</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option}
            variant={selectedOption === option ? 'default' : 'outline'}
            onClick={() => onSelect(option)}
            className="capitalize"
          >
            {option}
          </Button>
        ))}
        {selectedOption && (
          <Button
            variant="ghost"
            onClick={() => onSelect('')} // Option to clear selection
            className="capitalize text-red-500 hover:text-red-700"
          >
            Clear {label}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AttributeSelector;
