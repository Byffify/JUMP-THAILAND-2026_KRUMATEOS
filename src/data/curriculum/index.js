import { MATH } from './Math.js';
import { THAI } from './Thai.js';
import { ENGLISH } from './English.js';
import { SCIENCE } from './Science.js';
import { SOCIAL_STUDIES } from './SocialStudies.js';
import { PHYSICS } from './Physics.js';
import { CHEMISTRY } from './Chemistry.js';
import { BIOLOGY } from './Biology.js';
import { HISTORY } from './History.js';
import { GEOGRAPHY } from './Geography.js';
import { COMPUTING } from './Computing.js';
import { OTHER } from './Other.js';

export const TEMPLATES = [
  ...MATH,
  ...THAI,
  ...ENGLISH,
  ...SCIENCE,
  ...SOCIAL_STUDIES,
  ...PHYSICS,
  ...CHEMISTRY,
  ...BIOLOGY,
  ...HISTORY,
  ...GEOGRAPHY,
  ...COMPUTING,
  ...OTHER
];

export function findTemplateById(id) {
  return TEMPLATES.find(t => t.id === id) || null;
}