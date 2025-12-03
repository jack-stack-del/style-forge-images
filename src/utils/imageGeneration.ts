
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

  console.log(`[GENERATE] Model: ${selectedModel.name} | Prompt: "${fullPrompt}" | Negative: "${negativePrompt || 'N/A'}" | URL: ${url}`);
  if (negativePrompt) {
    console.log(`[ImageGeneration Debug] Negative Prompt: ${negativePrompt}`);
  }
  if (uploadedImage) {
    console.log(`[ImageGeneration Debug] Uploaded Image (Base64/URL start): ${uploadedImage.substring(0, 50)}...`);
    console.log(`[ImageGeneration Debug] Img2Img Strength: ${img2imgStrength}`);
  }
  return url;
};

export const cleanPrompt = (prompt: string): string => {
  const phrases = [
    'photorealistic image of',
    'ultra realistic photo of',
    'realistic image of'
  ];
  
  let cleaned = prompt;
  
  phrases.forEach(phrase => {
    const regex = new RegExp(`(${phrase})\\s+(${phrase})`, 'gi');
    cleaned = cleaned.replace(regex, '$1');
  });
  
  return cleaned.trim();
};

interface GenerateMultipleImagesParams {
  basePrompt: string;
  selectedModel: Model;
  selectedAttributes: Record<string, string | string[]>;
  negativePrompt?: string;
  uploadedImage?: string | null;
  img2imgStrength?: number;
  width: number;
  height: number;
  guidanceScale: number;
}

export const generateMultipleImages = (
  params: GenerateMultipleImagesParams,
  styles: string[]
): string[] => {
  const imageUrls: string[] = [];
  styles.forEach(style => {
    // For simplicity, we'll append the style to the base prompt for now.
    // In a more advanced scenario, you might adjust the model or other parameters per style.
    const styledPrompt = `${params.basePrompt} in ${style} style`;
    const imageUrl = generateImageUrl(
      styledPrompt,
      params.selectedModel, // Note: The actual model might change per style in a real scenario
      params.selectedAttributes,
      params.negativePrompt,
      params.uploadedImage,
      params.img2imgStrength,
      String(Math.floor(Math.random() * 1000000)) // Use a new random seed for each image
    );
    imageUrls.push(imageUrl);
  });
  return imageUrls;
};

export const getInitialModels = (): Model[] => [
  { id: "pollinations", name: "Pollinations", style: "pollinations", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: "pony-realistic", name: "Pony Realistic", style: "pony-realistic", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: "juggernaut-xl", name: "Juggernaut XL", style: "juggernaut-xl", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: "realism-engine", name: "Realism Engine", style: "realism-engine", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: "cinematic-redmond", name: "Cinematic Redmond", style: "cinematic-redmond", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: "flux-realism", name: "Flux Realism", style: "flux-realism", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image'], contentPolicy: 'lenient' },
  { id: "realistic-vision", name: "Realistic Vision", style: "realistic-vision", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image'], contentPolicy: 'lenient' },
  { id: "deepfloyd-if", name: "DeepFloyd IF", style: "deepfloyd-if", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image'], contentPolicy: 'lenient' },
  { id: "stable-diffusion-3", name: "Stable Diffusion 3", style: "stable-diffusion-3", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: "sdxl", name: "SDXL", style: "sdxl", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: "dreamshaper-xl", name: "Dreamshaper XL", style: "dreamshaper-xl", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: "realistic-vision-xl", name: "Realistic Vision XL", style: "realistic-vision-xl", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: "dazzle-diffusion", name: "Dazzle Diffusion", style: "dazzle-diffusion", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: "photon", name: "Photon", style: "photon", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: "protovision-xl", name: "ProtoVision XL", style: "protovision-xl", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: "midjourney-style", name: "Midjourney Style", style: "midjourney-style", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image'], contentPolicy: 'lenient' },
  { id: "dall-e-3", name: "Dall-E 3", style: "dall-e-3", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image'], contentPolicy: 'lenient' },
  { id: "anime-v3", name: "Anime V3", style: "anime-v3", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image'], contentPolicy: 'lenient' },
  { id: "pixel-art", name: "Pixel Art", style: "pixel-art", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image'], contentPolicy: 'lenient' },
  { id: "abstract-art", name: "Abstract Art", style: "abstract-art", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image'], contentPolicy: 'lenient' }
];
