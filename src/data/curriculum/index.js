import { MATH } from './Math.js';

export const TEMPLATES = [
  ...MATH
];

export function findTemplateById(id) {
  return TEMPLATES.find(t => t.id === id) || null;
}