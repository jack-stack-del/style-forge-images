export interface Model {
  id: string; // Unique identifier for the model
  name: string;
  style: string;
  description?: string;
  apiEndpoint?: string; // Optional API endpoint for alternative services
  promptPrefix?: string; // Optional prefix to add to the prompt when this model is used
  capabilities?: string[]; // Add capabilities to the model interface
  contentPolicy?: string; // Add contentPolicy to the model interface
}

export const availableModels: Model[] = [
  { id: 'stable-diffusion-xl', name: 'Stable Diffusion XL', style: 'photorealistic', promptPrefix: 'photorealistic image of', description: 'A model optimized for highly realistic images.', capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: 'flux-pro', name: 'Flux Pro', style: 'hyperrealistic', promptPrefix: 'hyperrealistic detailed artwork of', description: 'Advanced model for intricate and hyperrealistic art.', capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: 'anime-v2', name: 'Anime V2', style: 'anime style', promptPrefix: 'anime style illustration of', description: 'Specialized in anime and manga style generations.', capabilities: ['text-to-image'], contentPolicy: 'lenient' },
  { id: 'cartoon-classic', name: 'Cartoon Classic', style: 'cartoon', promptPrefix: 'classic cartoon drawing of', description: 'Generates images in a vibrant, classic cartoon aesthetic.', capabilities: ['text-to-image'], contentPolicy: 'lenient' },
  { id: 'pollinations', name: "Pollinations", style: "pollinations", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: 'pony-realistic', name: "Pony Realistic", style: "pony-realistic", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: 'juggernaut-xl', name: "Juggernaut XL", style: "juggernaut-xl", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: 'realism-engine', name: "Realism Engine", style: "realism-engine", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: 'cinematic-redmond', name: "Cinematic Redmond", style: "cinematic-redmond", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: 'flux-realism', name: "Flux Realism", style: "flux-realism", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image'], contentPolicy: 'lenient' },
  { id: 'realistic-vision', name: "Realistic Vision", style: "realistic-vision", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image'], contentPolicy: 'lenient' },
  { id: 'deepfloyd-if', name: "DeepFloyd IF", style: "deepfloyd-if", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image'], contentPolicy: 'lenient' },
  { id: 'stable-diffusion-3', name: "Stable Diffusion 3", style: "stable-diffusion-3", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: 'sdxl', name: "SDXL", style: "sdxl", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: 'dreamshaper-xl', name: "Dreamshaper XL", style: "dreamshaper-xl", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: 'realistic-vision-xl', name: "Realistic Vision XL", style: "realistic-vision-xl", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: 'dazzle-diffusion', name: "Dazzle Diffusion", style: "dazzle-diffusion", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: 'photon', name: "Photon", style: "photon", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: 'protovision-xl', name: "ProtoVision XL", style: "protovision-xl", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image', 'image-to-image'], contentPolicy: 'lenient' },
  { id: 'midjourney-style', name: "Midjourney Style", style: "midjourney-style", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image'], contentPolicy: 'lenient' },
  { id: 'dall-e-3', name: "Dall-E 3", style: "dall-e-3", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image'], contentPolicy: 'lenient' },
  { id: 'anime-v3', name: "Anime V3", style: "anime-v3", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image'], contentPolicy: 'lenient' },
  { id: 'pixel-art', name: "Pixel Art", style: "pixel-art", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image'], contentPolicy: 'lenient' },
  { id: 'abstract-art', name: "Abstract Art", style: "abstract-art", apiEndpoint: "https://image.pollinations.ai/prompt/", capabilities: ['text-to-image'], contentPolicy: 'lenient' }
];
