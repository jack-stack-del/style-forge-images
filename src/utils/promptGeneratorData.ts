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
    label: 'Character Type',
    options: subjects.filter(s => ['1girl', '2girls', 'a couple', 'group of women'].includes(s.name)),
  },
  {
    label: 'Subject',
    options: subjects.filter(s => ['woman', 'beautiful woman', 'sensual woman', 'curvy woman', 'athletic woman', 'femme fatale', 'submissive girl', 'dominant woman'].includes(s.name)),
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
    label: 'Style',
    options: styles,
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

  // 1. Character Type and Subject
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

    // Check if we already have a beauty descriptor
    const hasBeautyDescriptor = subjectDescription.includes('beautiful') ||
                                subjectDescription.includes('stunning') ||
                                subjectDescription.includes('gorgeous');

    if (!hasBeautyDescriptor) {
      parts.push(`A stunningly beautiful ${subjectDescription}`);
    } else {
      parts.push(subjectDescription);
    }
  }

  // 2. Body Type
  const bodyType = selectedAttributes['Body Type'];
  if (bodyType && typeof bodyType === 'object' && 'keywords' in bodyType && Array.isArray((bodyType as { keywords: string[] }).keywords)) {
    parts.push(`with a ${(bodyType as { keywords: string[] }).keywords.join(', ')} body`);
  }

  // 3. Pose/Action/Positions
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
    parts.push(`is ${actionAndPosition.join(' and ')}`);
  }

  // 4. Attire (Clothing)
  const attire = selectedAttributes.Attire;
  if (attire && Array.isArray(attire) && attire.length > 0) {
    const attireDescriptions = attire.map((c: unknown) => {
      if (typeof c === 'object' && c !== null && 'keywords' in c && Array.isArray((c as Clothing).keywords)) {
        return `wearing a ${(c as Clothing).material ? (c as Clothing).material + ' ' : ''}${(c as Clothing).keywords.join(' ')}`;
      }
      return '';
    }).filter(Boolean);
    if (attireDescriptions.length > 0) {
      parts.push(`and is ${attireDescriptions.join(', ')}`);
    }
  }

  // 5. Expression
  const expression = selectedAttributes.Expression;
  if (expression && typeof expression === 'object' && 'keywords' in expression && Array.isArray((expression as { keywords: string[] }).keywords)) {
    parts.push(`with an ${(expression as { keywords: string[] }).keywords.join(', ')} expression`);
  }

  // 6. Setting
  const setting = selectedAttributes.Setting;
  if (setting && typeof setting === 'object' && 'keywords' in setting && Array.isArray((setting as { keywords: string[] }).keywords)) {
    parts.push(`in a ${(setting as { keywords: string[] }).keywords.join(' ')}`);
  }

  // 7. Lighting
  const lighting = selectedAttributes.Lighting;
  if (lighting && typeof lighting === 'object' && 'keywords' in lighting && Array.isArray((lighting as { keywords: string[] }).keywords)) {
    parts.push(`under ${(lighting as { keywords: string[] }).keywords.join(' ')} lighting`);
  }

  // 8. Camera Angle
  const cameraAngle = selectedAttributes['Camera Angle'];
  if (cameraAngle && typeof cameraAngle === 'object' && 'keywords' in cameraAngle && Array.isArray((cameraAngle as { keywords: string[] }).keywords)) {
    parts.push(`from a ${(cameraAngle as { keywords: string[] }).keywords.join(' ')} angle`);
  }

  // 9. Enhancements (multi-select)
  const enhancementsAttr = selectedAttributes.Enhancements;
  if (enhancementsAttr && Array.isArray(enhancementsAttr) && enhancementsAttr.length > 0) {
    const enhancements = enhancementsAttr.map((e: unknown) => {
      if (typeof e === 'object' && e !== null && 'keywords' in e && Array.isArray((e as Enhancement).keywords)) {
        return (e as Enhancement).keywords.join(' ');
      }
      return '';
    }).filter(Boolean);
    if (enhancements.length > 0) {
      parts.push(`with added details such as ${enhancements.join(', ')}`);
    }
  }

  // 10. Style (always last, potentially as a stylistic suffix or phrase)
  const style = selectedAttributes.Style;
  if (style && typeof style === 'object' && 'name' in style && typeof (style as { name: string }).name === 'string') {
    parts.push(`in the style of ${(style as { name: string }).name}`);
  }

  // 11. Add model-specific prompt prefix
  const selectedStyle = selectedAttributes.Style as Style | undefined;
  let modelPrefix = '';
  if (selectedStyle && selectedStyle.preferredModel) {
    const preferredModel = availableModels.find(model => model.id === selectedStyle.preferredModel);
    if (preferredModel && preferredModel.promptPrefix) {
      modelPrefix = preferredModel.promptPrefix;
    }
  }
  let finalPrompt = `${modelPrefix} ${parts.join(' ')}`;
  // Ensure proper sentence structure (e.g., capitalize first letter)
  finalPrompt = finalPrompt.charAt(0).toUpperCase() + finalPrompt.slice(1);
  // Do not automatically add a period, let the user decide.
  return finalPrompt;
};
