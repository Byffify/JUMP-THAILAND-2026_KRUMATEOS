import { LEVELS, SUBJECTS, levelLabel } from '../src/data/types.js';
import { DICT } from '../src/services/i18n.js';
import assert from 'node:assert';

assert.strictEqual(LEVELS.length, 13, '13 levels expected');
assert.strictEqual(SUBJECTS.length, 12, '12 subjects expected');
assert.strictEqual(levelLabel('p4', 'th'), 'ชั้น ป.4');
assert.strictEqual(levelLabel('m3', 'en'), 'M.3');

const newSubjectKeys = [
  'gen.subjectPhysics', 'gen.subjectChemistry', 'gen.subjectBiology',
  'gen.subjectHistory', 'gen.subjectGeography', 'gen.subjectComputing'
];
for (const key of newSubjectKeys) {
  assert.ok(DICT.en[key], `en missing ${key}`);
  assert.ok(DICT.th[key], `th missing ${key}`);
}
for (const s of SUBJECTS) {
  assert.ok(DICT.en[s.key], `en missing ${s.key}`);
  assert.ok(DICT.th[s.key], `th missing ${s.key}`);
}
for (const key of ['gen.levelLabel', 'gen.subjectLabel', 'gen.cta', 'gen.sub']) {
  assert.ok(DICT.en[key], `en missing ${key}`);
  assert.ok(DICT.th[key], `th missing ${key}`);
}
assert.ok(!DICT.en['gen.summary'].includes('{n}'), 'gen.summary should not interpolate {n}');

console.log('verify-level-subject: PASS');