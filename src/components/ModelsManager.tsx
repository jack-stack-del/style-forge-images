
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Model } from '@/types/imageGenerator';
import { X, Plus } from 'lucide-react';

interface ModelsManagerProps {
  models: Model[];
  onModelsChange: (models: Model[]) => void;
}

const ModelsManager: React.FC<ModelsManagerProps> = ({ models, onModelsChange }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newModelName, setNewModelName] = useState('');
  const [newModelStyle, setNewModelStyle] = useState('');

  const handleAddModel = () => {
    if (!newModelName.trim() || !newModelStyle.trim()) {
      alert('Please enter both model name and style');
      return;
    }

    if (models.some(model => model.name.toLowerCase() === newModelName.toLowerCase())) {
      alert('A model with this name already exists');
      return;
    }

    const newModel: Model = {
      name: newModelName.trim(),
      style: newModelStyle.trim()
    };

    onModelsChange([...models, newModel]);
    setNewModelName('');
    setNewModelStyle('');
    setShowAddForm(false);
  };

  const handleRemoveModel = (index: number) => {
    if (confirm('Are you sure you want to remove this model?')) {
      const updatedModels = models.filter((_, i) => i !== index);
      onModelsChange(updatedModels);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setNewModelName('');
    setNewModelStyle('');
  };

  return (
    <div className="models-section mb-8 p-5 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">AI Models</h3>
        <Button 
          onClick={() => setShowAddForm(true)}
          size="sm"
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Model
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
        {models.map((model, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md">
            <span className="font-medium text-sm">{model.name}</span>
            <Button
              onClick={() => handleRemoveModel(index)}
              size="sm"
              variant="destructive"
              className="w-6 h-6 p-0 rounded-full"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end mt-4 p-4 bg-white rounded-md border">
          <div>
            <Input
              type="text"
              value={newModelName}
              onChange={(e) => setNewModelName(e.target.value)}
              placeholder="Model name (e.g., Anime)"
              className="text-sm"
            />
          </div>
          <div>
            <Input
              type="text"
              value={newModelStyle}
              onChange={(e) => setNewModelStyle(e.target.value)}
              placeholder="Style string (e.g., anime style)"
              className="text-sm"
            />
          </div>
          <Button 
            onClick={handleAddModel}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            Save
          </Button>
          <Button 
            onClick={handleCancel}
            size="sm"
            variant="outline"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default ModelsManager;
