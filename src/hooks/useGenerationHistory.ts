import { useState, useEffect, useCallback } from 'react';
import { GeneratedImageClone } from '@/types/imageGeneratorClone';

interface GenerationHistoryEntry {
  id: string;
  timestamp: number;
  prompt: string;
  negativePrompt?: string;
  modelName: string;
  seed: string;
  imageUrl: string;
  width: number;
  height: number;
  guidanceScale: number;
  sourceImage?: string;
}

const STORAGE_KEY = 'generationHistory';
const MAX_HISTORY_ITEMS = 100;

export const useGenerationHistory = () => {
  const [history, setHistory] = useState<GenerationHistoryEntry[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedHistory = JSON.parse(stored);
        setHistory(Array.isArray(parsedHistory) ? parsedHistory : []);
      }
    } catch (error) {
      console.error('Failed to load generation history:', error);
      setHistory([]);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save generation history:', error);
    }
  }, [history]);

  const addToHistory = useCallback((image: GeneratedImageClone, additionalData?: {
    width?: number;
    height?: number;
    guidanceScale?: number;
    sourceImage?: string;
    negativePrompt?: string;
  }) => {
    const entry: GenerationHistoryEntry = {
      id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      prompt: image.prompt,
      negativePrompt: additionalData?.negativePrompt || image.negativePrompt,
      modelName: image.modelName,
      seed: image.seed,
      imageUrl: image.url,
      width: additionalData?.width || 512,
      height: additionalData?.height || 512,
      guidanceScale: additionalData?.guidanceScale || 7.5,
      sourceImage: additionalData?.sourceImage || image.sourceImage,
    };

    setHistory(prev => {
      const newHistory = [entry, ...prev];
      // Keep only the most recent MAX_HISTORY_ITEMS
      return newHistory.slice(0, MAX_HISTORY_ITEMS);
    });
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    setHistory(prev => prev.filter(entry => entry.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const searchHistory = useCallback((query: string) => {
    if (!query.trim()) return history;

    const lowercaseQuery = query.toLowerCase();
    return history.filter(entry =>
      entry.prompt.toLowerCase().includes(lowercaseQuery) ||
      entry.modelName.toLowerCase().includes(lowercaseQuery) ||
      entry.seed.includes(query)
    );
  }, [history]);

  const getHistoryByDateRange = useCallback((startDate: Date, endDate: Date) => {
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();

    return history.filter(entry =>
      entry.timestamp >= startTime && entry.timestamp <= endTime
    );
  }, [history]);

  const exportHistory = useCallback(() => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `generation-history-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [history]);

  const importHistory = useCallback((importedHistory: GenerationHistoryEntry[]) => {
    if (Array.isArray(importedHistory)) {
      setHistory(prev => {
        const combined = [...importedHistory, ...prev];
        // Remove duplicates based on ID and keep most recent MAX_HISTORY_ITEMS
        const unique = combined.filter((entry, index, self) =>
          index === self.findIndex(e => e.id === entry.id)
        );
        return unique.slice(0, MAX_HISTORY_ITEMS);
      });
    }
  }, []);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    searchHistory,
    getHistoryByDateRange,
    exportHistory,
    importHistory,
  };
};
