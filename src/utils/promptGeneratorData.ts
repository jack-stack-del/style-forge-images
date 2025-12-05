import { Model, availableModels } from './promptData/models';

export type { Model }; // Re-export Model as a type
export { availableModels };
import { Subject, subjects } from './promptData/subjects';
import { Pose, actions, positions } from './promptData/poses';
import { Clothing, attires } from './promptData/clothing';
import { BodyType, bodyTypes } from './promptData/bodies';
import { Expression, expressions } from './promptData/expressions';
import { Setting, settings } from './promptData/settings';
import { Style, styles, Lighting, CameraAngle, Enhancement, lightings, cameraAngles, enhancements } from './promptData/styles';



export interface PromptCategoryStructured {
  label: string;
  options: (Subject | Pose | Clothing | BodyType | Expression | Setting | Style | Lighting | CameraAngle | Enhancement)[];
  multiSelect?: boolean;
}

export const promptCategories: PromptCategoryStructured[] = [
  // Style is now handled separately in the UI, not here to avoid duplication
  {
    label: 'Character Type',
    options: [
      { name: '1girl', keywords: ['1girl'] },
      { name: '2girls', keywords: ['2girls'] },
      { name: '3girls', keywords: ['3girls'] }
    ],
  },
  {
    label: 'Subject',
    options: subjects.filter(s => ['1girl', '2girls', '3girls', 'submissive girl', 'dominant girl'].includes(s.name)), // Adjusted to use 'girl' consistently
  },
  {
    label: 'Action',
    options: actions,
    multiSelect: true,
  },
  {
    label: 'Positions',
    options: positions,
    multiSelect: true,
  },
  {
    label: 'Attire',
    options: attires,
    multiSelect: true,
  },
  {
    label: 'Body Type',
    options: bodyTypes,
  },
  {
    label: 'Expression',
    options: expressions,
  },
  {
    label: 'Setting',
    options: settings,
  },
  {
    label: 'Lighting',
    options: lightings,
  },
  {
    label: 'Camera Angle',
    options: cameraAngles,
  },
  {
    label: 'Enhancements',
    options: enhancements,
    multiSelect: true,
  },
];

export const generateSmartPrompt = (selectedAttributes: Record<string, unknown>): string => {
  const parts: string[] = [];

  // OPTIMIZED ORDER: Quality → Subject → Style → Details → Technical
  // Based on prompt engineering research for diffusion models

  // 1. PRIMARY SUBJECT (most important - gets emphasis)
  let primarySubject = "";
  const characterType = selectedAttributes['Character Type'];
  const subject = selectedAttributes.Subject;

  if (characterType && typeof characterType === 'object' && 'keywords' in characterType && Array.isArray((characterType as { keywords: string[] }).keywords)) {
    primarySubject = (characterType as { keywords: string[] }).keywords.join(' ');
  } else if (subject && typeof subject === 'object' && 'keywords' in subject && Array.isArray((subject as { keywords: string[] }).keywords)) {
    primarySubject = (subject as { keywords: string[] }).keywords.join(' ');
  }

  if (primarySubject) {
    // Replace any "female" with "girl" and add emphasis for subject
    primarySubject = primarySubject.replace(/female/gi, 'girl');
    parts.push(`(${primarySubject})`); // Primary subject gets parentheses for emphasis
  }

  // 2. STYLE & QUALITY (high priority)
  const style = selectedAttributes.Style;
  if (style && typeof style === 'object' && 'keywords' in style && Array.isArray((style as { keywords: string[] }).keywords)) {
    // Style keywords get emphasis
    const styleText = (style as { keywords: string[] }).keywords.join(' ');
    parts.push(`{${styleText}}`); // Style gets braces for high emphasis
  }

  // 3. ACTION & POSE (dynamic elements)
  const actionParts: string[] = [];
  const action = selectedAttributes.Action;
  const positions = selectedAttributes.Positions;

  if (action && Array.isArray(action) && action.length > 0) {
    const actions = action.map((a: unknown) => ((a as { description?: string }).description || (a as { name?: string }).name)).filter(Boolean);
    actionParts.push(actions.join(' '));
  }
  if (positions && Array.isArray(positions) && positions.length > 0) {
    const poses = positions.map((p: unknown) => ((p as { description?: string }).description || (p as { name?: string }).name)).filter(Boolean);
    actionParts.push(poses.join(' '));
  }
  if (actionParts.length > 0) {
    parts.push(actionParts.join(', '));
  }

  // 4. PHYSICAL ATTRIBUTES (body type, attire)
  const physicalParts: string[] = [];

  // Body Type
  const bodyType = selectedAttributes['Body Type'];
  if (bodyType && typeof bodyType === 'object' && 'keywords' in bodyType && Array.isArray((bodyType as { keywords: string[] }).keywords)) {
    physicalParts.push((bodyType as { keywords: string[] }).keywords.join(' '));
  }

  // Attire (Clothing) - important for composition
  const attire = selectedAttributes.Attire;
  if (attire && Array.isArray(attire) && attire.length > 0) {
    const attireDescriptions = attire.map((c: unknown) => {
      if (typeof c === 'object' && c !== null && 'keywords' in c && Array.isArray((c as Clothing).keywords)) {
        const material = (c as Clothing).material ? (c as Clothing).material + ' ' : '';
        return `${material}${(c as Clothing).keywords.join(' ')}`;
      }
      return '';
    }).filter(Boolean);
    if (attireDescriptions.length > 0) {
      physicalParts.push(`wearing ${attireDescriptions.join(' and ')}`);
    }
  }

  if (physicalParts.length > 0) {
    parts.push(physicalParts.join(', '));
  }

  // 5. EXPRESSION & EMOTION (facial details)
  const expression = selectedAttributes.Expression;
  if (expression && typeof expression === 'object' && 'keywords' in expression && Array.isArray((expression as { keywords: string[] }).keywords)) {
    parts.push((expression as { keywords: string[] }).keywords.join(' '));
  }

  // 6. ENVIRONMENT (setting, lighting - lower priority)
  const environmentParts: string[] = [];

  const setting = selectedAttributes.Setting;
  if (setting && typeof setting === 'object' && 'keywords' in setting && Array.isArray((setting as { keywords: string[] }).keywords)) {
    environmentParts.push((setting as { keywords: string[] }).keywords.join(' '));
  }

  const lighting = selectedAttributes.Lighting;
  if (lighting && typeof lighting === 'object' && 'keywords' in lighting && Array.isArray((lighting as { keywords: string[] }).keywords)) {
    environmentParts.push((lighting as { keywords: string[] }).keywords.join(' '));
  }

  if (environmentParts.length > 0) {
    parts.push(environmentParts.join(', '));
  }

  // 7. TECHNICAL DETAILS (camera, enhancements - lowest priority)
  const technicalParts: string[] = [];

  const cameraAngle = selectedAttributes['Camera Angle'];
  if (cameraAngle && typeof cameraAngle === 'object' && 'keywords' in cameraAngle && Array.isArray((cameraAngle as { keywords: string[] }).keywords)) {
    technicalParts.push((cameraAngle as { keywords: string[] }).keywords.join(' '));
  }

  // Enhancements (quality improvements)
  const enhancementsAttr = selectedAttributes.Enhancements;
  if (enhancementsAttr && Array.isArray(enhancementsAttr) && enhancementsAttr.length > 0) {
    const enhancements = enhancementsAttr.map((e: unknown) => {
      if (typeof e === 'object' && e !== null && 'keywords' in e && Array.isArray((e as Enhancement).keywords)) {
        return (e as Enhancement).keywords.join(' ');
      }
      return '';
    }).filter(Boolean);
    if (enhancements.length > 0) {
      // Quality enhancements get light emphasis
      technicalParts.push(`[${enhancements.join(' ')}]`);
    }
  }

  if (technicalParts.length > 0) {
    parts.push(technicalParts.join(', '));
  }

  // 8. MODEL-SPECIFIC PREFIX (if needed for certain models)
  const selectedStyle = selectedAttributes.Style as Style | undefined;
  let modelPrefix = '';
  if (selectedStyle && selectedStyle.preferredModel) {
    const preferredModel = availableModels.find(model => model.id === selectedStyle.preferredModel);
    if (preferredModel && preferredModel.promptPrefix) {
      modelPrefix = preferredModel.promptPrefix;
    }
  }

  // CONSTRUCT FINAL PROMPT WITH PROPER FORMATTING
  let finalPrompt = '';

  if (modelPrefix) {
    finalPrompt = `${modelPrefix}, `;
  }

  // Join parts with proper separators (commas work better than other separators for most models)
  finalPrompt += parts.join(', ');

  // Clean up formatting
  finalPrompt = finalPrompt
    .replace(/,+/g, ',') // Remove double commas
    .replace(/^,|,$/g, '') // Remove leading/trailing commas
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();

  // Ensure proper capitalization
  finalPrompt = finalPrompt.charAt(0).toUpperCase() + finalPrompt.slice(1);

  return finalPrompt;
};
