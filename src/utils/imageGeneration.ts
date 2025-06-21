
import { Model } from "@/types/imageGenerator";

export const generateImageUrl = (prompt: string, model: Model): string => {
  const fullPrompt = prompt + " in the style of " + model.style;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=512&height=512`;
};

export const getInitialModels = (): Model[] => [
  { name: "Pollinations", style: "pollinations" },
  { name: "Flux", style: "flux realism" },
  { name: "SD", style: "realistic vision" },
  { name: "D.F", style: "deepfloyd if" },
  { name: "SD3", style: "stable diffusion 3" },
  { name: "SD2", style: "sd 2" }
];
