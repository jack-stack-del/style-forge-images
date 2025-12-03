
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
export interface GeneratedImage {
  url: string;
  modelName: string;
  prompt: string;
  negativePrompt?: string;
  sourceImage?: string | null;
  seed?: string; // Add seed property
  error?: string; // Add error property
}

export interface PromptAttributes {
  style?: string;
  action?: string;
  hairColor?: string;
  // Add other attributes here as they are implemented in the UI
  // age?: string;
  // nationality?: string;
  // gender?: string;
  // bodyShape?: string;
  // eyeColor?: string;
  // hairstyle?: string;
  // makeup?: string;
  // clothing?: string;
  // pose?: string;
  // environment?: string;
  // lighting?: string;
}
