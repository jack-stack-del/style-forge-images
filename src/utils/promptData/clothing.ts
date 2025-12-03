export interface Clothing {
  name: string;
  type: 'top' | 'bottom' | 'full_body' | 'none';
  material?: string;
  keywords: string[];
}

export interface BodyType {
  name: string;
  keywords: string[];
}

export const attires: Clothing[] = [
  { name: "nude", type: "none", keywords: ["nude", "naked"] },
  { name: "topless", type: "top", keywords: ["topless"] },
  { name: "bottomless", type: "bottom", keywords: ["bottomless"] },
  { name: "sheer lingerie", type: "full_body", material: "sheer lace", keywords: ["sheer lingerie", "transparent underwear"] },
  { name: "lace bra", type: "top", material: "lace", keywords: ["lace bra"] },
  { name: "thong", type: "bottom", keywords: ["thong", "g-string"] },
  { name: "bodysuit", type: "full_body", keywords: ["bodysuit"] },
  { name: "fishnet stockings", type: "bottom", keywords: ["fishnet stockings"] },
  { name: "high heels", type: "none", keywords: ["high heels", "stilettos"] },
  { name: "unbuttoned shirt", type: "top", keywords: ["unbuttoned shirt"] },
  { name: "wet clothes", type: "full_body", keywords: ["wet clothes", "see-through clothes"] },
  { name: "bikini", type: "full_body", keywords: ["bikini"] },
  { name: "school uniform (unzipped)", type: "full_body", keywords: ["school uniform", "unzipped uniform"] },
  { name: "nurse outfit (open)", type: "full_body", keywords: ["nurse outfit", "open nurse uniform"] },
];

export const bodyTypes: BodyType[] = [
  { name: "busty", keywords: ["busty", "large breasts"] },
  { name: "curvy", keywords: ["curvy", "hourglass figure"] },
  { name: "slim", keywords: ["slim", "slender body"] },
  { name: "muscular", keywords: ["muscular", "athletic build"] },
  { name: "petite", keywords: ["petite", "small frame"] },
  { name: "voluptuous", keywords: ["voluptuous", "full-figured"] },
  { name: "toned", keywords: ["toned", "defined muscles"] },
];
