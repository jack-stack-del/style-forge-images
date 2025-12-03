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
  {
    label: 'Style', // MOVED TO TOP - PRIORITY FOR STYLE-FIRST PROMPTS
    options: styles,
  },
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

  // NEW ORDER: Style → Subject → Action → Additional Details

  // 1. Style Specification (moved to front - PRIORITY CHANGE)
  const style = selectedAttributes.Style;
  if (style && typeof style === 'object' && 'keywords' in style && Array.isArray((style as { keywords: string[] }).keywords)) {
    parts.push((style as { keywords: string[] }).keywords.join(' '));
  }

  // 2. Subject Specification (Character Type and Subject - streamlined)
  let subjectDescription = "";
  const characterType = selectedAttributes['Character Type'];
  const subject = selectedAttributes.Subject;

  if (characterType && typeof characterType === 'object' && 'keywords' in characterType && Array.isArray((characterType as { keywords: string[] }).keywords)) {
    subjectDescription = (characterType as { keywords: string[] }).keywords.join(' ');
  } else if (subject && typeof subject === 'object' && 'keywords' in subject && Array.isArray((subject as { keywords: string[] }).keywords)) {
    subjectDescription = (subject as { keywords: string[] }).keywords.join(' ');
  }

  if (subjectDescription) {
    // Replace any "female" with "girl" to maintain consistency
    subjectDescription = subjectDescription.replace(/female/gi, 'girl');
    // Remove "A stunningly beautiful" prefix for cleaner, style-first prompts
    parts.push(subjectDescription);
  }

  // 3. Action or Look (Action/Pose/Positions - streamlined)
  const actionAndPosition: string[] = [];
  const action = selectedAttributes.Action;
  const positions = selectedAttributes.Positions;

  if (action && Array.isArray(action) && action.length > 0) {
    actionAndPosition.push(action.map((a: unknown) => ((a as { description?: string }).description || (a as { name?: string }).name)).filter(Boolean).join(', '));
  }
  if (positions && Array.isArray(positions) && positions.length > 0) {
    actionAndPosition.push(positions.map((p: unknown) => ((p as { description?: string }).description || (p as { name?: string }).name)).filter(Boolean).join(', '));
  }
  if (actionAndPosition.length > 0) {
    parts.push(actionAndPosition.join(', '));
  }

  // 4. Additional Details (Body Type, Attire, Expression, Setting, Lighting, Camera Angle, Enhancements)

  // Body Type
  const bodyType = selectedAttributes['Body Type'];
  if (bodyType && typeof bodyType === 'object' && 'keywords' in bodyType && Array.isArray((bodyType as { keywords: string[] }).keywords)) {
    parts.push((bodyType as { keywords: string[] }).keywords.join(', '));
  }

  // Attire (Clothing)
  const attire = selectedAttributes.Attire;
  if (attire && Array.isArray(attire) && attire.length > 0) {
    const attireDescriptions = attire.map((c: unknown) => {
      if (typeof c === 'object' && c !== null && 'keywords' in c && Array.isArray((c as Clothing).keywords)) {
        return `wearing ${(c as Clothing).material ? (c as Clothing).material + ' ' : ''}${(c as Clothing).keywords.join(' ')}`;
      }
      return '';
    }).filter(Boolean);
    if (attireDescriptions.length > 0) {
      parts.push(attireDescriptions.join(', '));
    }
  }

  // Expression
  const expression = selectedAttributes.Expression;
  if (expression && typeof expression === 'object' && 'keywords' in expression && Array.isArray((expression as { keywords: string[] }).keywords)) {
    parts.push((expression as { keywords: string[] }).keywords.join(', '));
  }

  // Setting
  const setting = selectedAttributes.Setting;
  if (setting && typeof setting === 'object' && 'keywords' in setting && Array.isArray((setting as { keywords: string[] }).keywords)) {
    parts.push((setting as { keywords: string[] }).keywords.join(', '));
  }

  // Lighting
  const lighting = selectedAttributes.Lighting;
  if (lighting && typeof lighting === 'object' && 'keywords' in lighting && Array.isArray((lighting as { keywords: string[] }).keywords)) {
    parts.push((lighting as { keywords: string[] }).keywords.join(', '));
  }

  // Camera Angle
  const cameraAngle = selectedAttributes['Camera Angle'];
  if (cameraAngle && typeof cameraAngle === 'object' && 'keywords' in cameraAngle && Array.isArray((cameraAngle as { keywords: string[] }).keywords)) {
    parts.push((cameraAngle as { keywords: string[] }).keywords.join(', '));
  }

  // Enhancements (multi-select)
  const enhancementsAttr = selectedAttributes.Enhancements;
  if (enhancementsAttr && Array.isArray(enhancementsAttr) && enhancementsAttr.length > 0) {
    const enhancements = enhancementsAttr.map((e: unknown) => {
      if (typeof e === 'object' && e !== null && 'keywords' in e && Array.isArray((e as Enhancement).keywords)) {
        return (e as Enhancement).keywords.join(' ');
      }
      return '';
    }).filter(Boolean);
    if (enhancements.length > 0) {
      parts.push(enhancements.join(', '));
    }
  }

  // 5. Add model-specific prompt prefix (if available)
  const selectedStyle = selectedAttributes.Style as Style | undefined;
  let modelPrefix = '';
  if (selectedStyle && selectedStyle.preferredModel) {
    const preferredModel = availableModels.find(model => model.id === selectedStyle.preferredModel);
    if (preferredModel && preferredModel.promptPrefix) {
      modelPrefix = preferredModel.promptPrefix;
    }
  }

  // Join all parts with commas for cleaner style-first prompts
  let finalPrompt = `${modelPrefix} ${parts.join(', ')}`.trim();

  // Remove any double commas or leading/trailing commas
  finalPrompt = finalPrompt.replace(/,+/g, ',').replace(/^,|,$/g, '');

  // Ensure proper sentence structure (capitalize first letter)
  finalPrompt = finalPrompt.charAt(0).toUpperCase() + finalPrompt.slice(1);

  return finalPrompt;
};
