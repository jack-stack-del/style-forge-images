
import { Model } from "@/types/imageGenerator";

export const generateImageUrl = (
  basePrompt: string, // This basePrompt now contains all attributes from ImageGenerator.tsx
  selectedModel: Model,
  selectedAttributes: Record<string, string | string[]>, // Still accept to check for 'Style'
  negativePrompt?: string, // Add negativePrompt parameter
  uploadedImage?: string | null, // Add uploadedImage parameter for img2img
  img2imgStrength?: number, // Add img2imgStrength parameter
  fixedSeed?: string // Add an optional fixed seed parameter
): string => {
  let fullPrompt = basePrompt;

  // Determine the base API endpoint
  const baseApiUrl = selectedModel.apiEndpoint || "https://image.pollinations.ai/prompt/";

  // Append model's default style only if no specific style attribute is selected
  // The basePrompt already includes other attributes from generatePrompt(selectedAttributes) in ImageGenerator.tsx
  if (!selectedAttributes.Style) {
    fullPrompt += ` in the style of ${selectedModel.style}`;
  }

  const seed = fixedSeed || String(Math.floor(Math.random() * 1000000));
  let url = `${baseApiUrl}${encodeURIComponent(fullPrompt)}?width=512&height=512&seed=${seed}&nologo=true`;

  if (negativePrompt) {
    url += `&negative_prompt=${encodeURIComponent(negativePrompt)}`;
  }

  if (uploadedImage) {
    url += `&image=${encodeURIComponent(uploadedImage)}`;
    if (img2imgStrength !== undefined) {
      url += `&strength=${img2imgStrength}`;
    }
  }

  console.log(`[generateImageUrl] Model: ${selectedModel.name} | Full Prompt: "${fullPrompt}" | Negative: "${negativePrompt || 'N/A'}" | Final URL: ${url}`);
  if (negativePrompt) {
    console.log(`[generateImageUrl Debug] Negative Prompt: ${negativePrompt}`);
  }
  if (uploadedImage) {
    console.log(`[generateImageUrl Debug] Uploaded Image (Base64/URL start): ${uploadedImage.substring(0, 50)}...`);
    console.log(`[generateImageUrl Debug] Img2Img Strength: ${img2imgStrength}`);
  }
  return url;
};

export const cleanPrompt = (prompt: string): string => {
  let cleaned = prompt.toLowerCase();

  // First, clean exact duplicate phrases
  const phrases = [
    'photorealistic image of',
    'ultra realistic photo of',
    'realistic image of',
    'highly detailed',
    'high quality',
    'best quality'
  ];

  phrases.forEach(phrase => {
    const regex = new RegExp(`(${phrase})\\s+(${phrase})`, 'gi');
    cleaned = cleaned.replace(regex, phrase);
  });

  // Remove redundant similar words
  const redundantWords = [
    'photorealistic',
    'realistic',
    'ultra',
    'detailed',
    'quality',
    'high',
    'best'
  ];

  redundantWords.forEach(word => {
    // Replace multiple occurrences of the same word with single occurrence
    const wordRegex = new RegExp(`\\b${word}\\b(\\s+\\b${word}\\b)+`, 'gi');
    cleaned = cleaned.replace(wordRegex, word);
  });

  // Capitalize first letter and clean up extra spaces
  cleaned = cleaned.trim().replace(/\s+/g, ' ');
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

interface GenerateMultipleImagesParams {
  basePrompt: string;
  selectedModel: Model;
  selectedAttributes: Record<string, string | string[]>; // Reverted to original type
  negativePrompt?: string;
  uploadedImage?: string | null;
  img2imgStrength?: number;
  width?: number; // Kept optional
  height?: number; // Kept optional
  guidanceScale?: number; // Kept optional
}

export const generateMultipleImages = (
  params: GenerateMultipleImagesParams,
  models: Model[]
): { url: string; model: Model }[] => {
  const imageResults: { url: string; model: Model }[] = [];
  models.forEach(model => {
    console.log(`[generateMultipleImages] Generating with model: "${model.name}" (${model.style}) for prompt: "${params.basePrompt}"`);
    const imageUrl = generateImageUrl(
      params.basePrompt, // Use base prompt without style modification
      model, // Use the specific model for this image
      params.selectedAttributes,
      params.negativePrompt,
      params.uploadedImage,
      params.img2imgStrength,
      String(Math.floor(Math.random() * 1000000)) // Use a new random seed for each image
    );
    imageResults.push({ url: imageUrl, model: model });
  });
  return imageResults;
};

export const getInitialModels = (): Model[] => [
  // Core Pollinations models - comprehensive list
  { id: "flux", name: "FLUX", style: "flux", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: "flux-dev", name: "FLUX Dev", style: "flux-dev", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: "flux-pro", name: "FLUX Pro", style: "flux-pro", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: "flux-realism", name: "FLUX Realism", style: "flux-realism", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image'], contentPolicy: 'lenient' },
  { id: "flux-anime", name: "FLUX Anime", style: "flux-anime", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image'], contentPolicy: 'lenient' },
  { id: "flux-3d", name: "FLUX 3D", style: "flux-3d", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image'], contentPolicy: 'lenient' },

  // Stable Diffusion models
  { id: "stable-diffusion-3", name: "Stable Diffusion 3", style: "stable-diffusion-3", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: "stable-diffusion-3.5-large", name: "Stable Diffusion 3.5 Large", style: "stable-diffusion-3.5-large", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: "stable-diffusion-3.5-large-turbo", name: "Stable Diffusion 3.5 Large Turbo", style: "stable-diffusion-3.5-large-turbo", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: "sdxl", name: "SDXL", style: "sdxl", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: "sdxl-turbo", name: "SDXL Turbo", style: "sdxl-turbo", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },

  // Specialized models
  { id: "pony-realistic", name: "Pony Realistic", style: "pony-realistic", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: "juggernaut-xl", name: "Juggernaut XL", style: "juggernaut-xl", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: "realism-engine", name: "Realism Engine", style: "realism-engine", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: "cinematic-redmond", name: "Cinematic Redmond", style: "cinematic-redmond", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: "dreamshaper-xl", name: "Dreamshaper XL", style: "dreamshaper-xl", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: "realistic-vision-xl", name: "Realistic Vision XL", style: "realistic-vision-xl", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: "majic-mix-realistic", name: "Majic Mix Realistic", style: "majic-mix-realistic", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: "epiCRealism", name: "EpiC Realism", style: "epiCRealism", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },

  // Artistic and style models
  { id: "dazzle-diffusion", name: "Dazzle Diffusion", style: "dazzle-diffusion", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: "photon", name: "Photon", style: "photon", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: "protovision-xl", name: "ProtoVision XL", style: "protovision-xl", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: "counterfeit-xl", name: "Counterfeit XL", style: "counterfeit-xl", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },

  // Anime and illustration
  { id: "anime-v3", name: "Anime V3", style: "anime-v3", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image'], contentPolicy: 'lenient' },
  { id: "anything-v5", name: "Anything V5", style: "anything-v5", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image'], contentPolicy: 'lenient' },

  // Legacy and specialized
  { id: "realistic-vision", name: "Realistic Vision", style: "realistic-vision", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image'], contentPolicy: 'lenient' },
  { id: "deepfloyd-if", name: "DeepFloyd IF", style: "deepfloyd-if", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image'], contentPolicy: 'lenient' },
  { id: "midjourney-style", name: "Midjourney Style", style: "midjourney-style", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image'], contentPolicy: 'lenient' },
  { id: "dall-e-3", name: "Dall-E 3", style: "dall-e-3", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image'], contentPolicy: 'lenient' },

  // Creative and abstract
  { id: "pixel-art", name: "Pixel Art", style: "pixel-art", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image'], contentPolicy: 'lenient' },
  { id: "abstract-art", name: "Abstract Art", style: "abstract-art", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image'], contentPolicy: 'lenient' },

  // Fallback
  { id: "pollinations", name: "Pollinations (Default)", style: "pollinations", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' }
];
