export interface Style {
  name: string;
  keywords: string[];
  preferredModel?: string; // Optional preferred model for this style
}

export interface Lighting {
  name: string;
  keywords: string[];
}

export interface CameraAngle {
  name: string;
  keywords: string[];
}

export interface Enhancement {
  name: string;
  keywords: string[];
}

export const styles: Style[] = [
  { name: "photorealistic", keywords: ["photorealistic", "ultra realistic photo"], preferredModel: "stable-diffusion-xl" },
  { name: "hyperrealistic", keywords: ["hyperrealistic", "unbelievably realistic render"] },
  { name: "erotic art", keywords: ["erotic art", "sensual artwork"] },
  { name: "boudoir photography", keywords: ["boudoir photography", "intimate boudoir shot"] },
  { name: "explicit photography", keywords: ["explicit photography", "raw explicit photograph"] },
  { name: "dark fantasy", keywords: ["dark fantasy", "gritty dark fantasy art"] },
  { name: "hentai style", keywords: ["hentai style", "anime hentai drawing"] },
  { name: "manga porn", keywords: ["manga porn", "japanese manga style porn"] },
  { name: "pin-up art", keywords: ["pin-up art", "vintage pin-up illustration"] },
  { name: "fetish art", keywords: ["fetish art", "specific fetish artwork"] },
  { name: "glamour shot", keywords: ["glamour shot", "sultry glamour photograph"] },
  { name: "FLUX style", keywords: ["FLUX style", "cutting-edge FLUX art"], preferredModel: "flux-model" },
  { name: "HiDream Style", keywords: ["HiDream Style", "dreamlike high-quality render"] },
  { name: "SD 1.5 XL style", keywords: ["SD 1.5 XL style", "Stable Diffusion 1.5 XL aesthetic"] },
];

export const lightings: Lighting[] = [
  { name: "moody", keywords: ["moody lighting", "atmospheric light"] },
  { name: "sensual", keywords: ["sensual lighting", "soft seductive light"] },
  { name: "spotlight", keywords: ["spotlight", "focused spotlight"] },
  { name: "candlelight", keywords: ["candlelight", "flickering candlelight"] },
  { name: "natural light", keywords: ["natural light", "bright natural illumination"] },
  { name: "backlight", keywords: ["backlight", "strong backlight"] },
  { name: "neon glow", keywords: ["neon glow", "vibrant neon glow"] },
  { name: "low light", keywords: ["low light", "dimly lit scene"] },
  { name: "shadow play", keywords: ["shadow play", "dramatic shadows and light"] },
];

export const cameraAngles: CameraAngle[] = [
  { name: "close-up", keywords: ["close-up", "extreme close-up"] },
  { name: "full shot", keywords: ["full shot", "full body shot"] },
  { name: "wide shot", keywords: ["wide shot", "expansive wide shot"] },
  { name: "low angle", keywords: ["low angle", "worm's eye view"] },
  { name: "high angle", keywords: ["high angle", "bird's eye view"] },
  { name: "crotch shot", keywords: ["crotch shot", "view of crotch"] },
  { name: "butt shot", keywords: ["butt shot", "view from behind"] },
  { name: "breast shot", keywords: ["breast shot", "focus on breasts"] },
  { name: "from behind", keywords: ["from behind", "rear view"] },
  { name: "POV", keywords: ["POV", "point of view shot"] },
  { name: "upskirt", keywords: ["upskirt", "view up skirt"] },
  { name: "side view", keywords: ["side view", "profile shot"] },
];

export const enhancements: Enhancement[] = [
  { name: "highly detailed skin", keywords: ["highly detailed skin", "realistic skin texture"] },
  { name: "wet look", keywords: ["wet look", "moist skin"] },
  { name: "sweaty", keywords: ["sweaty", "glistening sweat"] },
  { name: "cumshot", keywords: ["cumshot", "facial cumshot"] },
  { name: "orgasm expression", keywords: ["orgasm expression", "face of pure pleasure"] },
  { name: "blushing", keywords: ["blushing", "flushed cheeks"] },
  { name: "nipple piercing", keywords: ["nipple piercing", "pierced nipples"] },
  { name: "tattoo", keywords: ["tattoo", "intricate tattoos"] },
  { name: "body jewelry", keywords: ["body jewelry", "erotic body jewelry"] },
  { name: "lingerie", keywords: ["lingerie", "delicate lingerie"] },
  { name: "stockings", keywords: ["stockings", "silky stockings"] },
  { name: "high heels", keywords: ["high heels", "sexy high heels"] },
  { name: "toys", keywords: ["toys", "sex toys"] },
  { name: "vibrator", keywords: ["vibrator", "vibrating dildo"] },
  { name: "dildo", keywords: ["dildo", "realistic dildo"] },
  { name: "restraints", keywords: ["restraints", "leather restraints"] },
  { name: "collared", keywords: ["collared", "wearing a collar"] },
  { name: "gags", keywords: ["gags", "ball gag"] },
  { name: "latex", keywords: ["latex", "shiny latex outfit"] },
  { name: "leather", keywords: ["leather", "supple leather outfit"] },
  { name: "chains", keywords: ["chains", "heavy chains"] },
  { name: "oil sheen", keywords: ["oil sheen", "oiled skin"] },
  { name: "glowing skin", keywords: ["glowing skin", "radiant skin"] },
  { name: "drooling", keywords: ["drooling", "saliva dripping"] },
];
