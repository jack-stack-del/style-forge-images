export interface Setting {
  name: string;
  keywords: string[];
}

export const settings: Setting[] = [
  { name: "bedroom", keywords: ["bedroom", "intimate bedroom setting"] },
  { name: "bathroom", keywords: ["bathroom", "steamy bathroom"] },
  { name: "shower", keywords: ["shower", "wet shower stall"] },
  { name: "hot tub", keywords: ["hot tub", "bubbling hot tub"] },
  { name: "private jet", keywords: ["private jet", "luxury private jet"] },
  { name: "yacht", keywords: ["yacht", "on a luxury yacht"] },
  { name: "dungeon", keywords: ["dungeon", "dark dungeon"] },
  { name: "forest clearing", keywords: ["forest clearing", "secluded forest clearing"] },
  { name: "abandoned building", keywords: ["abandoned building", "gritty abandoned building"] },
  { name: "red light district", keywords: ["red light district", "neon-lit red light district"] },
  { name: "strip club", keywords: ["strip club", "bustling strip club"] },
  { name: "private club", keywords: ["private club", "exclusive private club"] },
  { name: "hotel suite", keywords: ["hotel suite", "luxurious hotel suite"] },
  { name: "dark alley", keywords: ["dark alley", "grimy dark alley"] },
  { name: "secret lair", keywords: ["secret lair", "hidden secret lair"] },
  { name: "sex club", keywords: ["sex club", "underground sex club"] },
];
