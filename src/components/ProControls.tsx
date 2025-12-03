import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdvancedParameters, Model } from '@/types/imageGeneratorClone';

interface ProControlsProps {
  advancedParams: AdvancedParameters;
  setAdvancedParams: (params: AdvancedParameters) => void;
  models: Model[];
}

const aspectRatios = [
  { label: '1:1 (Square)', width: 512, height: 512 },
  { label: '16:9 (Landscape)', width: 1024, height: 576 },
  { label: '9:16 (Portrait)', width: 576, height: 1024 },
  { label: '4:3', width: 768, height: 576 },
  { label: '3:4', width: 576, height: 768 },
  { label: 'Custom', width: 512, height: 512 },
];

const ProControls: React.FC<ProControlsProps> = ({ advancedParams, setAdvancedParams, models }) => {
  const handleAspectRatioChange = (ratio: typeof aspectRatios[0]) => {
    setAdvancedParams({
      ...advancedParams,
      width: ratio.width,
      height: ratio.height,
    });
  };

  const handleRandomizeSeed = () => {
    setAdvancedParams({
      ...advancedParams,
      seed: Math.floor(Math.random() * 1000000),
    });
  };

  return (
    <div className="pro-controls mb-6 p-4 bg-gray-50 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Advanced Controls</h3>

      {/* Model */}
      <div className="mb-4">
        <Label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
          Model
        </Label>
        <select
          id="model"
          value={advancedParams.model}
          onChange={(e) => setAdvancedParams({ ...advancedParams, model: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          {models.map(model => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>

      {/* Seed */}
      <div className="mb-4">
        <Label htmlFor="seed" className="block text-sm font-medium text-gray-700 mb-2">
          Seed
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="seed"
            type="number"
            value={advancedParams.seed}
            onChange={(e) => setAdvancedParams({ ...advancedParams, seed: parseInt(e.target.value) || 0 })}
            disabled={advancedParams.randomizeSeed}
            className="flex-1"
            min="0"
            max="999999"
          />
          <input
            type="checkbox"
            id="randomize-seed"
            checked={advancedParams.randomizeSeed}
            onChange={(e) => setAdvancedParams({ ...advancedParams, randomizeSeed: e.target.checked })}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <Label htmlFor="randomize-seed" className="text-sm text-gray-700">
            Randomize
          </Label>
          <Button
            onClick={handleRandomizeSeed}
            variant="outline"
            size="sm"
            disabled={advancedParams.randomizeSeed}
          >
            🎲
          </Button>
        </div>
      </div>

      {/* Width & Height */}
      <div className="mb-4">
        <Label className="block text-sm font-medium text-gray-700 mb-2">
          Dimensions
        </Label>
        <div className="flex items-center gap-2 mb-2">
          <select
            value={aspectRatios.find(r => r.width === advancedParams.width && r.height === advancedParams.height)?.label || 'Custom'}
            onChange={(e) => {
              const selected = aspectRatios.find(r => r.label === e.target.value);
              if (selected) handleAspectRatioChange(selected);
            }}
            className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
          >
            {aspectRatios.map(ratio => (
              <option key={ratio.label} value={ratio.label}>
                {ratio.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Label htmlFor="width" className="text-xs text-gray-600">Width</Label>
            <Input
              id="width"
              type="number"
              value={advancedParams.width}
              onChange={(e) => setAdvancedParams({ ...advancedParams, width: parseInt(e.target.value) || 512 })}
              min="256"
              max="2048"
              step="64"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="height" className="text-xs text-gray-600">Height</Label>
            <Input
              id="height"
              type="number"
              value={advancedParams.height}
              onChange={(e) => setAdvancedParams({ ...advancedParams, height: parseInt(e.target.value) || 512 })}
              min="256"
              max="2048"
              step="64"
            />
          </div>
        </div>
      </div>

      {/* Guidance Scale */}
      <div className="mb-4">
        <Label htmlFor="guidance-scale" className="block text-sm font-medium text-gray-700 mb-2">
          Guidance Scale: {advancedParams.guidanceScale.toFixed(1)}
        </Label>
        <input
          type="range"
          id="guidance-scale"
          min="1"
          max="20"
          step="0.5"
          value={advancedParams.guidanceScale}
          onChange={(e) => setAdvancedParams({ ...advancedParams, guidanceScale: parseFloat(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Creative (1)</span>
          <span>Precise (20)</span>
        </div>
      </div>

      {/* Number of Images */}
      <div className="mb-4">
        <Label htmlFor="num-images" className="block text-sm font-medium text-gray-700 mb-2">
          Number of Images
        </Label>
        <Input
          id="num-images"
          type="number"
          value={advancedParams.numImages}
          onChange={(e) => setAdvancedParams({ ...advancedParams, numImages: Math.max(1, parseInt(e.target.value) || 1) })}
          min="1"
          max="10"
        />
      </div>
    </div>
  );
};

export default ProControls;
