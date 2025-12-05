import { useState, useEffect, useCallback } from 'react';
import { GeneratedImage } from '../types/imageGenerator';
import { Model } from '../utils/promptGeneratorData';
import { generateImageUrl, generateMultipleImages, cleanPrompt, getInitialModels } from '../utils/imageGeneration'; // Import generateMultipleImages and cleanPrompt
import { generateSmartPrompt, PromptCategoryStructured, availableModels } from '../utils/promptGeneratorData';
import { useToast } from "./use-toast";
import { enhancePrompt } from '../utils/promptEnhancer';

// Define a list of "daring" or stylistic modifiers
const variationModifiers = [
  "in a dynamic pose",
  "with an intense gaze",
  "with cinematic lighting",
  "in a revealing outfit",
  "with an alluring expression",
  "from a low angle shot",
  "with a soft, dreamlike glow",
];

interface UseImageGenerationProps {
  promptCategories: PromptCategoryStructured[];
  initialModels?: Model[];
  enableCoPilot?: boolean;
  geminiApiKey?: string;
}

export const useImageGeneration = ({ promptCategories, initialModels, enableCoPilot, geminiApiKey }: UseImageGenerationProps) => {
  const [prompt, setPrompt] = useState('');
  const [models, setModels] = useState<Model[]>(initialModels || []);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, any>>({}); // Revert to any to match external function expectations, disable lint for this line
  const [manualPrompt, setManualPrompt] = useState('');
  const [useManualPrompt, setUseManualPrompt] = useState(false);

  const [negativePrompt, setNegativePrompt] = useState('');
  const [likedImage, setLikedImage] = useState<{
    prompt: string;
    seed: string;
    imageUrl: string;
  } | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const { toast } = useToast();

  // Function to generate with all available models
  const handleGenerateWithAllModels = useCallback(async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Missing",
        description: "Please enter a prompt to generate images.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setImages([]);
    setGenerationError(null);

    try {
      const activeModel = models.length > 0 ? models[0] : availableModels.find(model => model.id === 'stable-diffusion-xl') || availableModels[0];
      let currentPrompt = prompt;

      if (enableCoPilot && geminiApiKey) {
        toast({
          title: "Enhancing Prompt",
          description: "Using Prompt Co-Pilot to enhance your prompt...",
        });
        currentPrompt = await enhancePrompt({ selectedAttributes: selectedAttributes, manualPrompt, negativePrompt, geminiApiKey });
        toast({
          title: "Prompt Enhanced",
          description: "Prompt Co-Pilot has finished enhancing your prompt.",
          variant: "success",
        });
      }

      const basePrompt = cleanPrompt(activeModel.promptPrefix ? `${activeModel.promptPrefix} ${currentPrompt}` : currentPrompt);

      // Generate with ALL available models for maximum variety
      const allModels = getInitialModels();
      const selectedModels = allModels.slice(0, -1); // Use all models except fallback (pollinations default)

      const imageResults = generateMultipleImages(
        {
          basePrompt,
          selectedModel: activeModel,
          selectedAttributes,
          negativePrompt,
          width: 512,
          height: 512,
          guidanceScale: 7.5,
        },
        selectedModels
      );

      const generatedImages: GeneratedImage[] = imageResults.map((result, index) => ({
        url: result.url,
        modelName: result.model.name,
        prompt: basePrompt,
        negativePrompt: negativePrompt,
        seed: String(Math.floor(Math.random() * 1000000)),
        error: undefined
      }));

      setImages(prev => [...generatedImages, ...prev]);

      toast({
        title: "Generation Complete",
        description: `Generated ${selectedModels.length} images using different models!`,
        variant: "success",
      });
    } catch (error: unknown) {
      console.error("Generation failed:", error);
      const errorMessage = (error as Error).message || "An unknown error occurred.";

      // Provide more helpful error messages
      let userFriendlyMessage = errorMessage;
      if (errorMessage.includes('fetch')) {
        userFriendlyMessage = "Network error - check your internet connection and try again.";
      } else if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
        userFriendlyMessage = "Rate limited by Pollinations.ai - wait a moment and try again.";
      } else if (errorMessage.includes('timeout')) {
        userFriendlyMessage = "Request timed out - Pollinations.ai might be busy. Try again.";
      } else if (errorMessage.includes('500') || errorMessage.includes('502') || errorMessage.includes('503')) {
        userFriendlyMessage = "Pollinations.ai server error - try again in a few minutes.";
      }

      setGenerationError(userFriendlyMessage);
      toast({
        title: "Generation Failed",
        description: userFriendlyMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, models, selectedAttributes, negativePrompt, enableCoPilot, geminiApiKey, toast, manualPrompt]);

  // Update models when initialModels prop changes
  useEffect(() => {
    if (initialModels) {
      setModels(initialModels);
    }
  }, [initialModels]);

  useEffect(() => {
    if (!useManualPrompt) {
      const generated = generateSmartPrompt(selectedAttributes);
      setPrompt(generated);
    }
  }, [selectedAttributes, useManualPrompt]);

  useEffect(() => {
    if (useManualPrompt) {
      setPrompt(manualPrompt);
    }
  }, [manualPrompt, useManualPrompt]);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Missing",
        description: "Please enter a prompt to generate images.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setImages([]);
    setGenerationError(null);

    try {
      const activeModel = models.length > 0 ? models[0] : availableModels.find(model => model.id === 'stable-diffusion-xl') || availableModels[0];
      let currentPrompt = prompt;

      if (enableCoPilot && geminiApiKey) {
        toast({
          title: "Enhancing Prompt",
          description: "Using Prompt Co-Pilot to enhance your prompt...",
        });
        currentPrompt = await enhancePrompt({ selectedAttributes: selectedAttributes, manualPrompt, negativePrompt, geminiApiKey }); // Pass selectedAttributes directly
        toast({
          title: "Prompt Enhanced",
          description: "Prompt Co-Pilot has finished enhancing your prompt.",
          variant: "success",
        });
      }

      const basePrompt = cleanPrompt(activeModel.promptPrefix ? `${activeModel.promptPrefix} ${currentPrompt}` : currentPrompt);

      // Generate multiple images using different models for maximum variety
      const allModels = getInitialModels();
      const selectedModels = allModels.slice(0, 6); // Use first 6 models for variety (can be adjusted)

      const imageResults = generateMultipleImages(
        {
          basePrompt,
          selectedModel: activeModel,
          selectedAttributes,
          negativePrompt,
          width: 512, // Default width
          height: 512, // Default height
          guidanceScale: 7.5, // Default guidance scale
        },
        selectedModels
      );

      const generatedImages: GeneratedImage[] = imageResults.map((result, index) => ({
        url: result.url,
        modelName: result.model.name, // Each image shows its actual model name
        prompt: basePrompt, // Same prompt for all images
        negativePrompt: negativePrompt,
        seed: String(Math.floor(Math.random() * 1000000)), // Each image gets a new seed
        error: undefined
      }));

      setImages(prev => [...generatedImages, ...prev]);
    } catch (error: unknown) { // Use unknown instead of any
      console.error("Generation failed:", error);
      const errorMessage = (error as Error).message || "An unknown error occurred.";

      // Provide more helpful error messages
      let userFriendlyMessage = errorMessage;
      if (errorMessage.includes('fetch')) {
        userFriendlyMessage = "Network error - check your internet connection and try again.";
      } else if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
        userFriendlyMessage = "Rate limited by Pollinations.ai - wait a moment and try again.";
      } else if (errorMessage.includes('timeout')) {
        userFriendlyMessage = "Request timed out - Pollinations.ai might be busy. Try again.";
      } else if (errorMessage.includes('500') || errorMessage.includes('502') || errorMessage.includes('503')) {
        userFriendlyMessage = "Pollinations.ai server error - try again in a few minutes.";
      }

      setGenerationError(userFriendlyMessage);
      toast({
        title: "Generation Failed",
        description: userFriendlyMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, models, selectedAttributes, negativePrompt, enableCoPilot, geminiApiKey, toast, manualPrompt]); // Added manualPrompt to dependencies

  const handleGenerateVariations = useCallback(async () => {
    if (!likedImage) {
      setGenerationError("No liked image to generate variations from.");
      return;
    }

    console.log("Generating variations for liked image...");
    const basePrompt = likedImage.prompt;
    const baseSeed = likedImage.seed;
    const modelForVariations = models.length > 0 ? models[0] : availableModels.find(model => model.id === 'stable-diffusion-xl') || availableModels[0];

    setIsGenerating(true);
    setImages([]);
    setGenerationError(null);

    try {
      const newGeneratedImages: GeneratedImage[] = variationModifiers.map(modifier => {
        const newPrompt = `${basePrompt}, ${modifier}`;
        const finalPrompt = cleanPrompt(modelForVariations.promptPrefix ? `${modelForVariations.promptPrefix} ${newPrompt}` : newPrompt);
        const imageUrl = generateImageUrl(finalPrompt, modelForVariations, selectedAttributes, negativePrompt, undefined, undefined, baseSeed);
        console.log(`Generating variation with prompt: ${finalPrompt} and seed: ${baseSeed}`);
        return {
          url: imageUrl,
          modelName: modelForVariations.name,
          prompt: finalPrompt,
          negativePrompt: negativePrompt,
          seed: baseSeed,
        };
      });
      setImages(newGeneratedImages);
    } catch (error: unknown) { // Use unknown instead of any
      console.error("Variation generation failed:", error);
      setGenerationError((error as Error).message || "An unknown error occurred during variation generation.");
    } finally {
      setIsGenerating(false);
    }
  }, [likedImage, models, selectedAttributes, negativePrompt]); // Removed generateImageUrl from dependencies

  return {
    prompt,
    setPrompt,
    models,
    setModels,
    images,
    isGenerating,
    selectedAttributes,
    setSelectedAttributes,
    manualPrompt,
    setManualPrompt,
    useManualPrompt,
    setUseManualPrompt,
    negativePrompt,
    setNegativePrompt,
    handleGenerate,
    handleGenerateWithAllModels,
    likedImage,
    setLikedImage,
    generationError,
    handleGenerateVariations,
  };
};
