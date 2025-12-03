/*
import { Subject } from './subjects';
import { Pose } from './poses';
import { Clothing } from './clothing';
import { Expression } from './expressions';
import { BodyType } from './bodies';
import { Setting } from './settings';
import { Style, Enhancement } from './styles';
import { availableModels } from './models'; // Added for randomizeNSFW

export const sensitiveAttributePool = {
  Subject: [
    { name: "1girl", keywords: ["1girl", "solo", "single female"] },
    { name: "2girls", keywords: ["2girls", "duo", "two women"] },
    { name: "a couple", keywords: ["a couple", "male and female together"] },
    { name: "woman", keywords: ["woman", "female"] },
    { name: "sensual woman", keywords: ["sensual woman", "alluring female"] },
    { name: "femme fatale", keywords: ["femme fatale", "seductive manipulator"] },
  ] as Subject[],
  Action: [
    { name: "orgasming", description: "orgasming" },
    { name: "masturbating", description: "masturbating" },
    { name: "sucking", description: "sucking" },
    { name: "fucking", description: "fucking" },
    { name: "spanking", description: "spanking" },
    { name: "tied up", description: "tied up" },
    { name: "grinding", description: "grinding" },
    { name: "fondling herself", description: "fondling herself" },
    { name: "exposing herself", description: "exposing herself" },
    { name: "undressing", description: "undressing" },
  ] as Pose[],
  Positions: [
    { name: "missionary", description: "in a missionary position" },
    { name: "doggy style", description: "from behind, on her hands and knees" },
    { name: "cowgirl", description: "in a cowgirl position" },
    { name: "69", description: "in a 69 position" },
    { name: "oral", description: "performing oral sex" },
    { name: "anal", description: "engaging in anal sex" },
    { name: "spread legs", description: "with spread legs" },
    { name: "bent over", description: "bent over" },
    { name: "kneeling", description: "kneeling" },
    { name: "sitting on face", description: "sitting on a face" },
  ] as Pose[],
  Attire: [
    { name: "nude", type: "none" as const, keywords: ["nude", "naked"] },
    { name: "topless", type: "top" as const, keywords: ["topless"] },
    { name: "sheer lingerie", type: "full_body" as const, material: "sheer lace", keywords: ["sheer lingerie", "transparent underwear"] },
    { name: "thong", type: "bottom" as const, keywords: ["thong", "g-string"] },
    { name: "bodysuit", type: "full_body" as const, keywords: ["bodysuit"] },
    { name: "fishnet stockings", type: "bottom" as const, keywords: ["fishnet stockings"] },
    { name: "wet clothes", type: "full_body" as const, keywords: ["wet clothes", "see-through clothes"] },
    { name: "unbuttoned shirt", type: "top" as const, keywords: ["unbuttoned shirt"] },
  ] as Clothing[],
  Expression: [
    { name: "orgasm expression", keywords: ["orgasm expression", "face of pure pleasure"] },
    { name: "lustful", keywords: ["lustful", "full of desire"] },
    { name: "ecstatic", keywords: ["ecstatic", "overjoyed"] },
    { name: "seductive smirk", keywords: ["seductive smirk", "playful smirk"] },
    { name: "blushing", keywords: ["blushing", "flushed cheeks"] },
    { name: "biting lip", keywords: ["biting lip", "teasing lip bite"] },
    { name: "moaning", keywords: ["moaning", "soft moans"] },
  ] as Expression[],
  Enhancements: [
    { name: "highly detailed skin", keywords: ["highly detailed skin", "realistic skin texture"] },
    { name: "wet look", keywords: ["wet look", "moist skin"] },
    { name: "sweaty", keywords: ["sweaty", "glistening sweat"] },
    { name: "cumshot", keywords: ["cumshot", "facial cumshot"] },
    { name: "nipple piercing", keywords: ["nipple piercing", "pierced nipples"] },
    { name: "tattoo", keywords: ["tattoo", "intricate tattoos"] },
    { name: "body jewelry", keywords: ["body jewelry", "erotic body jewelry"] },
    { name: "latex", keywords: ["latex", "shiny latex outfit"] },
    { name: "leather", keywords: ["leather", "supple leather outfit"] },
    { name: "oil sheen", keywords: ["oil sheen", "oiled skin"] },
  ] as Enhancement[],
  BodyType: [
    { name: "busty", keywords: ["busty", "large breasts"] },
    { name: "curvy", keywords: ["curvy", "hourglass figure"] },
    { name: "slim", keywords: ["slim", "slender body"] },
    { name: "muscular", keywords: ["muscular", "athletic build"] },
    { name: "petite", keywords: ["petite", "small frame"] },
    { name: "voluptuous", keywords: ["voluptuous", "full-figured"] },
    { name: "toned", keywords: ["toned", "defined muscles"] },
  ] as BodyType[],
  Setting: [
    { name: "bedroom", keywords: ["bedroom", "intimate bedroom setting"] },
    { name: "bathroom", keywords: ["bathroom", "steamy bathroom"] },
    { name: "shower", keywords: ["shower", "wet shower stall"] },
    { name: "hot tub", keywords: ["hot tub", "bubbling hot tub"] },
    { name: "private jet", keywords: ["private jet", "luxury private jet"] },
    { name: "yacht", keywords: ["yacht", "on a luxury yacht"] },
    { name: "dungeon", keywords: ["dungeon", "dark dungeon"] },
  ] as Setting[],
  Style: [
    { name: "photorealistic", keywords: ["photorealistic", "ultra realistic photo"], preferredModel: "stable-diffusion-xl" },
    { name: "hyperrealistic", keywords: ["hyperrealistic", "unbelievably realistic render"] },
    { name: "erotic art", keywords: ["erotic art", "sensual artwork"] },
    { name: "explicit photography", keywords: ["explicit photography", "raw explicit photograph"] },
    { name: "dark fantasy", keywords: ["dark fantasy", "gritty dark fantasy art"] },
    { name: "hentai style", keywords: ["hentai style", "anime hentai drawing"] },
    { name: "manga porn", keywords: ["manga porn", "japanese manga style porn"] },
  ] as Style[],
};

export const realisticStylePool: string[] = [
  'photorealistic',
  'hyperrealistic',
  'erotic art',
  'boudoir photography',
  'explicit photography',
  'glamour shot',
];

export const sceneTemplates: string[] = [
  "A stunningly beautiful {subject} is {action}.",
  "A photo of a {subject}, {action}.",
  "A {subject} who is {expression}.",
  "A {subject} with a {bodyType} body is {action}.",
  "A {subject} is wearing {attire} and is {action}.",
  "A {subject} in a {setting} is {action}.",
  "A {subject} is {action} with {enhancements}.",
];

export const randomizeNSFW = (): Record<string, any> => {
  const randomizedAttributes: Record<string, string | string[]> = {};

  // Pick random attributes
  const subject = sensitiveAttributePool.Subject[Math.floor(Math.random() * sensitiveAttributePool.Subject.length)];
  const action = sensitiveAttributePool.Action[Math.floor(Math.random() * sensitiveAttributePool.Action.length)];
  const attire = sensitiveAttributePool.Attire[Math.floor(Math.random() * sensitiveAttributePool.Attire.length)];
  const expression = sensitiveAttributePool.Expression[Math.floor(Math.random() * sensitiveAttributePool.Expression.length)];
  const setting = sensitiveAttributePool.Setting[Math.floor(Math.random() * sensitiveAttributePool.Setting.length)];
  const enhancements = sensitiveAttributePool.Enhancements[Math.floor(Math.random() * sensitiveAttributePool.Enhancements.length)];
  const bodyType = sensitiveAttributePool.BodyType[Math.floor(Math.random() * sensitiveAttributePool.BodyType.length)]; // Pick random bodyType

  // Build a full sentence using a template
  const template = sceneTemplates[Math.floor(Math.random() * sceneTemplates.length)];
  const prompt = template
    .replace('{subject}', subject.keywords[0]) // Using keywords[0] for simplicity in template
    .replace('{action}', action.description) // Using description for actions
    .replace('{attire}', attire.keywords[0]) // Using keywords[0] for simplicity
    .replace('{expression}', expression.keywords[0]) // Using keywords[0] for simplicity
    .replace('{setting}', setting.keywords[0]) // Using keywords[0] for simplicity
    .replace('{enhancements}', enhancements.keywords.join(', ')) // Joining keywords for enhancements
    .replace('{bodyType}', bodyType.keywords[0]); // Using keywords[0] for bodyType

  // Assign all attributes to the selectedAttributes object, including the generated prompt
  const attributes = {
    prompt: prompt, // Add the generated prompt to the returned object
    Subject: subject,
    Action: [action], // Action is multi-select
    Attire: [attire], // Attire is multi-select
    Expression: expression,
    Setting: setting,
    Enhancements: [enhancements], // Enhancements is multi-select
    BodyType: bodyType, // Add bodyType to the returned object
    Style: sensitiveAttributePool.Style.find(s => realisticStylePool.includes(s.name)), // Optionally add a random realistic style
  };
  console.log('RANDOMIZED ATTRIBUTES:', attributes);
  return attributes;
};
*/
