import { generateItems } from '../src/data/generator.js';
import { setLang } from '../src/services/i18n.js';
import assert from 'node:assert';

setLang('en');
let [it] = generateItems('Create a lesson about solar system', ['lesson'], { count: 0 }, { level: 'p6', subject: 'Science' });
assert.strictEqual(it.grade, 'Grade 6', 'override level label expected');
assert.strictEqual(it.subject, 'Science', 'override subject expected');

setLang('th');
[it] = generateItems('Create a lesson about solar system', ['lesson'], { count: 0 }, { level: 'p4', subject: 'คณิตศาสตร์' });
assert.strictEqual(it.grade, 'ชั้น ป.4', 'th override grade expected');
assert.strictEqual(it.subject, 'คณิตศาสตร์', 'th override subject expected');

setLang('en');
[it] = generateItems('Create a Grade 6 science lesson about ecosystems', ['lesson'], { count: 0 });
assert.strictEqual(it.grade, 'Grade 6', 'parity: sniffed grade kept');
assert.strictEqual(it.subject, 'Science', 'parity: sniffed subject kept');

assert.deepStrictEqual(generateItems('x', ['lesson', 'worksheet'], { count: 0 }).map(i => i.type), ['lesson', 'worksheet'], 'multi-type still supported at engine level');

console.log('verify-generator-overrides: PASS');