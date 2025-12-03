import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';

interface BatchJob {
  id: string;
  prompt: string;
  seed?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  imageUrl?: string;
  error?: string;
}

interface BatchGenerationControlsProps {
  onStartBatch: (jobs: BatchJob[]) => void;
  onPauseBatch: () => void;
  onStopBatch: () => void;
  onClearBatch: () => void;
  isGenerating: boolean;
  currentBatchJobs: BatchJob[];
  batchProgress: number;
}

const BatchGenerationControls: React.FC<BatchGenerationControlsProps> = ({
  onStartBatch,
  onPauseBatch,
  onStopBatch,
  onClearBatch,
  isGenerating,
  currentBatchJobs,
  batchProgress,
}) => {
  const [batchSize, setBatchSize] = useState(4);
  const [useRandomSeeds, setUseRandomSeeds] = useState(true);
  const [customPrompts, setCustomPrompts] = useState(['']);

  const addPrompt = () => {
    setCustomPrompts([...customPrompts, '']);
  };

  const removePrompt = (index: number) => {
    setCustomPrompts(customPrompts.filter((_, i) => i !== index));
  };

  const updatePrompt = (index: number, value: string) => {
    const newPrompts = [...customPrompts];
    newPrompts[index] = value;
    setCustomPrompts(newPrompts);
  };

  const generateBatchJobs = (): BatchJob[] => {
    const jobs: BatchJob[] = [];
    const validPrompts = customPrompts.filter(p => p.trim());

    for (let i = 0; i < Math.min(batchSize, validPrompts.length * 2); i++) {
      const promptIndex = i % validPrompts.length;
      const prompt = validPrompts[promptIndex];

      jobs.push({
        id: `batch-${Date.now()}-${i}`,
        prompt,
        seed: useRandomSeeds ? undefined : String(Math.floor(Math.random() * 1000000)),
        status: 'pending',
        progress: 0,
      });
    }

    return jobs;
  };

  const handleStartBatch = () => {
    const jobs = generateBatchJobs();
    if (jobs.length > 0) {
      onStartBatch(jobs);
    }
  };

  const completedJobs = currentBatchJobs.filter(job => job.status === 'completed').length;
  const failedJobs = currentBatchJobs.filter(job => job.status === 'failed').length;
  const totalJobs = currentBatchJobs.length;

  return (
    <div className="batch-controls mb-6 p-4 bg-gray-50 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Batch Generation</h3>

      {/* Batch Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="batch-size" className="text-sm font-medium text-gray-700">
            Batch Size
          </Label>
          <Input
            id="batch-size"
            type="number"
            min="1"
            max="20"
            value={batchSize}
            onChange={(e) => setBatchSize(parseInt(e.target.value) || 1)}
            disabled={isGenerating}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="random-seeds"
            checked={useRandomSeeds}
            onChange={(e) => setUseRandomSeeds(e.target.checked)}
            disabled={isGenerating}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <Label htmlFor="random-seeds" className="text-sm text-gray-700">
            Random Seeds
          </Label>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={handleStartBatch}
            disabled={isGenerating || customPrompts.filter(p => p.trim()).length === 0}
            className="flex-1"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Batch
          </Button>
          {isGenerating && (
            <>
              <Button onClick={onPauseBatch} variant="outline" size="sm">
                <Pause className="h-4 w-4" />
              </Button>
              <Button onClick={onStopBatch} variant="destructive" size="sm">
                <Square className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button onClick={onClearBatch} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      {totalJobs > 0 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Batch Progress: {completedJobs}/{totalJobs}
            </span>
            <div className="flex space-x-2">
              <Badge variant="secondary">{completedJobs} completed</Badge>
              {failedJobs > 0 && (
                <Badge variant="destructive">{failedJobs} failed</Badge>
              )}
            </div>
          </div>
          <Progress value={batchProgress} className="w-full" />
        </div>
      )}

      {/* Custom Prompts */}
      <div className="mb-4">
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          Custom Prompts (one per line, will cycle through for batch)
        </Label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {customPrompts.map((prompt, index) => (
            <div key={index} className="flex space-x-2">
              <Input
                value={prompt}
                onChange={(e) => updatePrompt(index, e.target.value)}
                placeholder={`Prompt ${index + 1}`}
                disabled={isGenerating}
                className="flex-1"
              />
              {customPrompts.length > 1 && (
                <Button
                  onClick={() => removePrompt(index)}
                  variant="outline"
                  size="sm"
                  disabled={isGenerating}
                >
                  ×
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button
          onClick={addPrompt}
          variant="outline"
          size="sm"
          className="mt-2"
          disabled={isGenerating}
        >
          Add Prompt
        </Button>
      </div>

      {/* Batch Job Status */}
      {currentBatchJobs.length > 0 && (
        <div className="mt-4">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Current Batch Jobs
          </Label>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {currentBatchJobs.slice(0, 10).map((job) => (
              <div key={job.id} className="flex items-center justify-between p-2 bg-white rounded border text-xs">
                <span className="truncate flex-1 mr-2">{job.prompt}</span>
                <Badge
                  variant={
                    job.status === 'completed' ? 'default' :
                    job.status === 'failed' ? 'destructive' :
                    job.status === 'running' ? 'secondary' : 'outline'
                  }
                  className="text-xs"
                >
                  {job.status}
                </Badge>
              </div>
            ))}
            {currentBatchJobs.length > 10 && (
              <div className="text-xs text-gray-500 text-center py-1">
                ... and {currentBatchJobs.length - 10} more jobs
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchGenerationControls;
