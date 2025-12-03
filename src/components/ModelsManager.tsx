import React, { useEffect, useState, useCallback, Dispatch, SetStateAction } from 'react';
import { availableModels, Model } from '@/utils/promptGeneratorData'; // Corrected import path

interface ModelsManagerProps {
  models: Model[];
  onModelsChange: Dispatch<SetStateAction<Model[]>>;
  selectedAttributes: Record<string, unknown>; // Use unknown instead of any
}

const ModelsManager: React.FC<ModelsManagerProps> = ({ models, onModelsChange, selectedAttributes }) => {
  const [preferredModel, setPreferredModel] = useState<Model | undefined>(undefined);

  // Function to get the preferred model based on selected style
  const getPreferredModel = useCallback((): Model | undefined => { // Wrap in useCallback
    const styleAttribute = selectedAttributes['Style'];
    if (Array.isArray(styleAttribute) && styleAttribute.length > 0) {
      // Assuming 'Style' attribute has a 'preferredModel' property
      const selectedStyle = styleAttribute[0] as { name: string; preferredModel?: string }; // Removed 'value: any' and refined type
      return availableModels.find(model => model.id === selectedStyle.preferredModel);
    }
    return undefined;
  }, [selectedAttributes]); // Add selectedAttributes to deps

  // Effect to update the preferred model when attributes change
  useEffect(() => {
    const newPreferredModel = getPreferredModel();
    setPreferredModel(newPreferredModel);
    if (newPreferredModel) {
      onModelsChange([newPreferredModel]);
    } else {
      // If no specific model is preferred by style, default to Stable Diffusion XL or the first available
      const defaultModel = availableModels.find(model => model.id === 'stable-diffusion-xl') || availableModels[0];
      setPreferredModel(defaultModel);
      onModelsChange([defaultModel]);
    }
  }, [selectedAttributes, onModelsChange, getPreferredModel]); // Added getPreferredModel to dependencies

  // Render the component
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Model</h3>
      {preferredModel ? (
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">{preferredModel.name}</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          <span className="text-sm text-gray-500">Default Model</span>
        </div>
      )}
    </div>
  );
};

export default ModelsManager;
