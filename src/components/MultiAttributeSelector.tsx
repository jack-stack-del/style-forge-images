import React from 'react';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui button

interface MultiAttributeSelectorProps {
  label: string;
  options: string[];
  selectedOptions: string[];
  onSelect: (option: string) => void;
}

const MultiAttributeSelector: React.FC<MultiAttributeSelectorProps> = ({
  label,
  options,
  selectedOptions,
  onSelect,
}) => {
  const handleOptionClick = (option: string) => {
    onSelect(option); // The parent component will handle adding/removing from the array
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">{label}:</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option}
            variant={selectedOptions.includes(option) ? 'default' : 'outline'}
            onClick={() => handleOptionClick(option)}
            className="capitalize"
          >
            {option}
          </Button>
        ))}
        {selectedOptions.length > 0 && (
          <Button
            variant="ghost"
            onClick={() => selectedOptions.forEach(onSelect)} // Option to clear all selections
            className="capitalize text-red-500 hover:text-red-700"
          >
            Clear {label}
          </Button>
        )}
      </div>
    </div>
  );
};

export default MultiAttributeSelector;
