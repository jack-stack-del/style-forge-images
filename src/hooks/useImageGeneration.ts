import { useState, useEffect, useCallback } from 'react';
import { GeneratedImage } from '../types/imageGenerator';
import { Model } from '../utils/promptGeneratorData';
import { generateImageUrl, generateMultipleImages, cleanPrompt } from '../utils/imageGeneration'; // Import generateMultipleImages and cleanPrompt
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
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, any>>({}); // Revert to any to match external function expectations
  const [manualPrompt, setManualPrompt] = useState('');
  const [useManualPrompt, setUseManualPrompt] = useState(false);

  const [negativePrompt, setNegativePrompt] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [img2imgStrength, setImg2imgStrength] = useState(0.7);
  const [likedImage, setLikedImage] = useState<{
    prompt: string;
    seed: string;
    imageUrl: string;
  } | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const { toast } = useToast();

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

      const basePrompt = activeModel.promptPrefix ? `${activeModel.promptPrefix} ${currentPrompt}` : currentPrompt;

      // Always generate multiple images with different styles
      const selectedStyles = ['photorealistic', 'FLUX style', 'HiDream Style', 'SD 1.5 XL style'];

      const imageUrls = generateMultipleImages(
        {
          basePrompt,
          selectedModel: activeModel,
          selectedAttributes,
          negativePrompt,
          uploadedImage,
          img2imgStrength,
          width: 512, // Default width
          height: 512, // Default height
          guidanceScale: 7.5, // Default guidance scale
        },
        selectedStyles
      );

      const generatedImages: GeneratedImage[] = imageUrls.map((url, index) => ({
        url,
        modelName: activeModel.name, // Assuming the same model for all, or adapt if different models are used per style
        prompt: `${basePrompt} in ${selectedStyles[index]} style`, // Adjust prompt to reflect the style
        negativePrompt: negativePrompt,
        sourceImage: uploadedImage,
        seed: String(Math.floor(Math.random() * 1000000)), // Each image gets a new seed
        error: undefined
      }));

      setImages(prev => [...generatedImages, ...prev]);
    } catch (error: unknown) { // Use unknown instead of any
      console.error("Generation failed:", error);
      setGenerationError((error as Error).message || "An unknown error occurred.");
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, models, selectedAttributes, negativePrompt, uploadedImage, img2imgStrength, enableCoPilot, geminiApiKey, toast, manualPrompt]); // Added manualPrompt to dependencies

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
        const finalPrompt = modelForVariations.promptPrefix ? `${modelForVariations.promptPrefix} ${newPrompt}` : newPrompt;
        const imageUrl = generateImageUrl(finalPrompt, modelForVariations, selectedAttributes, negativePrompt, uploadedImage, img2imgStrength, baseSeed);
        console.log(`Generating variation with prompt: ${finalPrompt} and seed: ${baseSeed}`);
        return {
          url: imageUrl,
          modelName: modelForVariations.name,
          prompt: finalPrompt,
          negativePrompt: negativePrompt,
          sourceImage: uploadedImage,
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
  }, [likedImage, models, selectedAttributes, negativePrompt, uploadedImage, img2imgStrength, generateImageUrl]); // Added generateImageUrl to dependencies

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
    uploadedImage,
    setUploadedImage,
    img2imgStrength,
    setImg2imgStrength,
    handleGenerate,
    likedImage,
    setLikedImage,
    generationError,
    handleGenerateVariations,
  };
};
