import { MATH } from './Math.js';
import { THAI } from './Thai.js';
import { ENGLISH } from './English.js';
import { SCIENCE } from './Science.js';

export const TEMPLATES = [
  ...MATH,
  ...THAI,
  ...ENGLISH,
  ...SCIENCE
];

export function findTemplateById(id) {
  return TEMPLATES.find(t => t.id === id) || null;
}