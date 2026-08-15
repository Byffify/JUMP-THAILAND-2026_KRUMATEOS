import { TEMPLATES } from '../src/data/curriculum/index.js';
import { LEVELS, SUBJECTS } from '../src/data/types.js';
import assert from 'node:assert';

const GRADES = LEVELS.filter(l => l.value !== 'k').map(l => l.value);
const SUBJECT_VALUES = SUBJECTS.map(s => s.value);

assert.ok(TEMPLATES.length >= 12, 'expected at least 12 templates, got ' + TEMPLATES.length); // raised in later tasks (48, 132, 144)

for (const t of TEMPLATES) {
  assert.strictEqual(t.type, 'slides', t.id + ' must be slides');
  assert.ok(SUBJECT_VALUES.includes(t.subject), t.id + ' invalid subject ' + t.subject);
  assert.ok(GRADES.includes(t.grade), t.id + ' invalid grade ' + t.grade);
  assert.ok(t.id.startsWith('moe-'), t.id + ' must start with moe-');
  assert.ok(t.topic && t.topic.th && t.topic.en, t.id + ' missing bilingual topic');
  assert.ok(Array.isArray(t.indicators) && t.indicators.length > 0, t.id + ' missing indicators');
  assert.ok(t.slides.length >= 5 && t.slides.length <= 8, t.id + ' must have 5-8 slides');
  for (const s of t.slides) {
    assert.ok(s.title && s.title.th && s.title.en, t.id + ' slide missing bilingual title');
    for (const b of s.bullets || []) {
      assert.ok(b && b.th && b.en, t.id + ' bullet must be {th,en}');
    }
  }
}

const ids = TEMPLATES.map(t => t.id);
assert.strictEqual(new Set(ids).size, ids.length, 'duplicate template ids');

console.log('verify-curriculum: PASS (' + TEMPLATES.length + ' templates)');