import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ApiKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({ isOpen, onClose, onSave }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!apiKey.trim()) return;

    setIsSaving(true);
    try {
      onSave(apiKey.trim());
      setApiKey('');
      onClose();
    } catch (error) {
      console.error('Error saving API key:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setApiKey('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>OpenRouter API Key Required</DialogTitle>
          <DialogDescription>
            To use the prompt enhancement feature, you need an OpenRouter API key.
            Get one for free at{' '}
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              openrouter.ai/keys
            </a>
            <br />
            <br />
            <strong>Note:</strong> Your API key is stored temporarily in your browser session and forgotten when you close the tab.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="api-key" className="text-sm font-medium">
              API Key
            </Label>
            <Input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-or-v1-..."
              className="mt-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                }
              }}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!apiKey.trim() || isSaving}>
              {isSaving ? 'Saving...' : 'Save Key'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyDialog;
