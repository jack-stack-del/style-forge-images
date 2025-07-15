import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Model } from '@/types/imageGenerator';
import { ChevronDown, X, Plus } from 'lucide-react';

interface FloatingModelsPanelProps {
  models: Model[];
  onModelsChange: (models: Model[]) => void;
}

const FloatingModelsPanel: React.FC<FloatingModelsPanelProps> = ({ models, onModelsChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newModelName, setNewModelName] = useState('');
  const [newModelStyle, setNewModelStyle] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        toggleRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !toggleRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowAddForm(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const togglePanel = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setShowAddForm(false);
      handleCancel();
    }
  };

  return (
    <div className="fixed top-5 right-5 z-50">
      {/* Toggle Button */}
      <button
        ref={toggleRef}
        onClick={togglePanel}
        className="w-11 h-11 bg-panel border border-panel-border rounded-lg text-foreground hover:bg-panel-hover transition-all duration-300 flex items-center justify-center shadow-lg"
      >
        <ChevronDown 
          className={`w-[18px] h-[18px] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Panel Content */}
      <div
        ref={panelRef}
        className={`absolute top-[54px] right-0 w-[340px] bg-panel border border-panel-border rounded-xl p-6 shadow-2xl transition-all duration-300 ${
          isOpen 
            ? 'opacity-100 visible translate-y-0' 
            : 'opacity-0 invisible -translate-y-3'
        }`}
        style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' }}
      >
        <div className="text-lg font-bold mb-[18px] text-foreground">
          AI Models
        </div>

        {/* Models List */}
        <div className="mb-6">
          {models.map((model, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 bg-background border border-border rounded-lg mb-[10px] text-sm"
            >
              <span className="text-foreground font-semibold">{model.name}</span>
              <button
                onClick={() => handleRemoveModel(index)}
                className="w-6 h-6 bg-transparent border-none text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 rounded-md flex items-center justify-center text-base"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Add Model Section */}
        <div className="border-t border-border pt-5">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full p-3 bg-background border border-border rounded-lg text-muted-foreground text-sm hover:bg-panel-hover hover:border-ring transition-all duration-200"
          >
            + Add New Model
          </button>

          {showAddForm && (
            <div className="mt-4 space-y-3">
              <Input
                type="text"
                value={newModelName}
                onChange={(e) => setNewModelName(e.target.value)}
                placeholder="Model name (e.g., Anime)"
                className="w-full p-3 bg-background border border-border rounded-lg text-foreground text-sm placeholder:text-muted-foreground focus:border-ring"
              />
              <Input
                type="text"
                value={newModelStyle}
                onChange={(e) => setNewModelStyle(e.target.value)}
                placeholder="Style description (e.g., anime style)"
                className="w-full p-3 bg-background border border-border rounded-lg text-foreground text-sm placeholder:text-muted-foreground focus:border-ring"
              />
              <div className="flex gap-[10px]">
                <Button
                  onClick={handleAddModel}
                  className="flex-1 p-[10px] bg-accent text-accent-foreground font-semibold text-[13px] hover:bg-accent/80 border border-border rounded-lg"
                >
                  Save
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1 p-[10px] bg-background text-muted-foreground text-[13px] hover:bg-panel-hover border border-border rounded-lg"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloatingModelsPanel;