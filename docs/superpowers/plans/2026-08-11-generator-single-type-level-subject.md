# Generator: Single-Type + Study Level & Subject Selectors Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restrict the Generator to one output type at a time and add bilingual study-level + subject selectors whose UI values override prompt-sniffed grade/subject on generated items.

**Architecture:** All new form state lives locally in `GeneratorPage` (approach A). `src/data/types.js` exports `LEVELS` and `SUBJECTS` constant lists plus a `levelLabel(value, lang)` helper; `src/data/generator.js` and `src/services/api.js` accept optional `{ level, subject }` overrides with a parity fallback to existing regex/keyword sniffing when absent. `AppContext` drops the now-dead `pendingAllTypes`.

**Tech Stack:** React 18, Vite, Tailwind v3, Node (ESM) for verification. No test framework installed — verification is Node CLI checks + `npm.cmd run build` + manual preview (matches repo conventions).

## Global Constraints

- Exactly one output type selected at all times (radio-style: click replaces, never 0).
- Level options: 13 Thai bands — `k` (อนุบาล/Kindergarten), `p1`…`p6`, `m1`…`m6`. Labels inline bilingual: `{ en, th }`.
- Subject options: 12 — Science, Mathematics, Thai, English, Social Studies, Other (reuse `login.subject*` keys) + Physics, Chemistry, Biology, History, Geography, Computing (new `gen.subject*` keys).
- All UI strings via `useI18n().t(key)`; every new key must exist in BOTH `en` and `th` dicts.
- Level default `'p4'`; subject default = logged-in `user.subject` when it is one of the 12, else `'Science'`.
- UI level/subject override generated item `grade`/`subject`; when not provided, old prompt-sniffing behavior is preserved byte-for-byte.
- `pendingAllTypes` removed from `AppContext` and all consumers.
- No `_bundle`, no multi-item generation, no new localStorage keys.
- Use `npm.cmd` (not `npm`). Do not reformat unrelated existing code.

---

### Task 1: Data + i18n groundwork

**Files:**
- Modify: `src/data/types.js`
- Modify: `src/services/i18n.js`
- Test: `scripts/verify-level-subject.mjs` (create)

**Interfaces:**
- Consumes: nothing new (reacts to existing `DICT` EN/TH dicts, `lang`, `t` in `i18n.js`).
- Produces: `LEVELS` (array of `{ value, label: { en, th } }`), `SUBJECTS` (array of `{ value, key }`), `levelLabel(value, lang) → string`, plus i18n keys `gen.subjectPhysics|Chemistry|Biology|History|Geography|Computing`, `gen.levelLabel`, `gen.subjectLabel`, updated `gen.cta`/`gen.sub`.

- [ ] **Step 1: Add LEVELS/SUBJECTS/levelLabel to `src/data/types.js`**

Append to `src/data/types.js` (after the existing `labelFor`):

```js
export const LEVELS = [
  { value: 'k',  label: { en: 'Kindergarten', th: 'อนุบาล' } },
  { value: 'p1', label: { en: 'Grade 1', th: 'ชั้น ป.1' } },
  { value: 'p2', label: { en: 'Grade 2', th: 'ชั้น ป.2' } },
  { value: 'p3', label: { en: 'Grade 3', th: 'ชั้น ป.3' } },
  { value: 'p4', label: { en: 'Grade 4', th: 'ชั้น ป.4' } },
  { value: 'p5', label: { en: 'Grade 5', th: 'ชั้น ป.5' } },
  { value: 'p6', label: { en: 'Grade 6', th: 'ชั้น ป.6' } },
  { value: 'm1', label: { en: 'M.1', th: 'ชั้น ม.1' } },
  { value: 'm2', label: { en: 'M.2', th: 'ชั้น ม.2' } },
  { value: 'm3', label: { en: 'M.3', th: 'ชั้น ม.3' } },
  { value: 'm4', label: { en: 'M.4', th: 'ชั้น ม.4' } },
  { value: 'm5', label: { en: 'M.5', th: 'ชั้น ม.5' } },
  { value: 'm6', label: { en: 'M.6', th: 'ชั้น ม.6' } }
];

export const SUBJECTS = [
  { value: 'Science',        key: 'login.subjectScience' },
  { value: 'Mathematics',    key: 'login.subjectMath' },
  { value: 'Thai',           key: 'login.subjectThai' },
  { value: 'English',        key: 'login.subjectEnglish' },
  { value: 'Social Studies', key: 'login.subjectSocial' },
  { value: 'Other',          key: 'login.subjectOther' },
  { value: 'Physics',        key: 'gen.subjectPhysics' },
  { value: 'Chemistry',      key: 'gen.subjectChemistry' },
  { value: 'Biology',        key: 'gen.subjectBiology' },
  { value: 'History',        key: 'gen.subjectHistory' },
  { value: 'Geography',      key: 'gen.subjectGeography' },
  { value: 'Computing',      key: 'gen.subjectComputing' }
];

export function levelLabel(value, lang) {
  const l = LEVELS.find(entry => entry.value === value);
  return l ? (l.label[lang] || l.label.en || '') : '';
}
```

- [ ] **Step 2: Add i18n keys to `src/services/i18n.js` (both dicts)**

In the `en` dict, next to the existing `gen.*` block (around line 62-71):

```js
    'gen.sub': 'Write a prompt, pick one output type, and generate your material.',
    ...
    'gen.levelLabel': 'Study level',
    'gen.subjectLabel': 'Subject',
    'gen.subjectPhysics': 'Physics',
    'gen.subjectChemistry': 'Chemistry',
    'gen.subjectBiology': 'Biology',
    'gen.subjectHistory': 'History',
    'gen.subjectGeography': 'Geography',
    'gen.subjectComputing': 'Computing',
```

Change the EN `gen.cta` value from `'✨ Generate all'` to `'✨ Generate'`.

In the `th` dict, mirror the same keys (around line 188-204):

```js
    'gen.sub': 'เขียนคำสั่ง เลือกประเภทผลงาน 1 ประเภท แล้วสร้างสื่อของคุณ',
    ...
    'gen.levelLabel': 'ระดับชั้น',
    'gen.subjectLabel': 'วิชา',
    'gen.subjectPhysics': 'ฟิสิกส์',
    'gen.subjectChemistry': 'เคมี',
    'gen.subjectBiology': 'ชีววิทยา',
    'gen.subjectHistory': 'ประวัติศาสตร์',
    'gen.subjectGeography': 'ภูมิศาสตร์',
    'gen.subjectComputing': 'คอมพิวเตอร์',
```

Change the TH `gen.cta` value from `'✨ สร้างทั้งหมด'` to `'✨ สร้างเลย'`.

- [ ] **Step 3: Write verification script `scripts/verify-level-subject.mjs`**

Create `scripts/` and this file:

```js
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
```

- [ ] **Step 4: Fix `gen.summary` to fixed copy (both dicts)**

The existing EN value is `'Generating: {n} material(s) from your prompt…'` (line 72) and TH `'กำลังสร้าง: {n} ชิ้นจากคำสั่งของคุณ…'` (line 199). Replace with:

EN: `'Generating: 1 material from your prompt…'`
TH: `'กำลังสร้าง: 1 ชิ้นจากคำสั่งของคุณ…'`

(the account for the `<summary>` change comes in Task 2; the `{n}` must be gone for the verify script's final assert to pass).

- [ ] **Step 5: Run the verification script**

Run: `node scripts/verify-level-subject.mjs`
Expected: `verify-level-subject: PASS` (no thrown assertion).

- [ ] **Step 6: Syntax + build check, commit**

Run: `node --check src/data/types.js; node --check src/services/i18n.js; if ($?) { npm.cmd run build }`
Expected: both `node --check` OK; build exit 0, no warnings.

```bash
git add src/data/types.js src/services/i18n.js scripts/verify-level-subject.mjs
git commit -m "feat: add level & subject option lists and i18n keys for generator"
```

---

### Task 2: Engine overrides (generator.js + api.js)

**Files:**
- Modify: `src/data/generator.js`
- Modify: `src/services/api.js`
- Test: `scripts/verify-generator-overrides.mjs` (create)

**Interfaces:**
- Consumes: `LEVELS`/`levelLabel` from `src/data/types.js` (Task 1); existing `parsePrompt`, `guessSubject`, builder functions.
- Produces: `generateItems(prompt, types, quizOpts, { level, subject }) → Array` with UI-overridden `grade`/`subject`, parity fallback; `API.generate` accepts and forwards `level`/`subject`.

- [ ] **Step 1: Add override parameter to `generateItems` in `src/data/generator.js`**

Import `levelLabel` at the top (next to existing imports, line ~7):

```js
import { levelLabel } from './types.js';
```

Change the `generateItems` signature and its `parsePrompt` wiring (line 291):

```js
export function generateItems(prompt, types, quizOpts, opts) {
  const lang = getLang();
  const parsed = parsePrompt(prompt);
  if (opts && opts.level) parsed.grade = levelLabel(opts.level, lang);
  if (quizOpts && quizOpts.count) parsed.count = Number(quizOpts.count) || parsed.count;
  const prefs = (quizOpts && quizOpts.kinds && quizOpts.kinds.length) ? quizOpts.kinds : ['mc', 'tf', 'sa'];
  const subject = (opts && opts.subject) ? opts.subject : null;
  const items = [];
  (types && types.length ? types : ['lesson']).forEach(t => {
    let item;
    if (t === 'lesson') item = buildLesson(prompt, parsed, { subject });
    else if (t === 'worksheet') item = buildWorksheet(prompt, parsed, { subject });
    else if (t === 'quiz') item = buildQuiz(prompt, parsed, { subject }, prefs);
    else if (t === 'slides') item = buildSlides(prompt, parsed, { subject });
    else if (t === 'rubric') item = buildRubric(prompt, parsed, { subject });
    else if (t === 'activity') item = buildActivity(prompt, parsed, { subject });
    if (item) {
      item.id = fmtId();
      items.push(item);
    }
  });
  return items;
}
```

- [ ] **Step 2: Thread `subject` override through every builder**

For each of the six builders, update the signature and the `subject:` line. The `grade` field remains `parsed.grade` everywhere (already satisfied by Step 1).

Example pattern for `buildLesson` (lines 45-79) — apply the identical change to `buildWorksheet` (line 83: `subject: guessSubject(prompt)` → `subject: opts.subject || guessSubject(prompt)`), `buildQuiz` (line 175), `buildSlides` (line 194 + the title-slide subtitle at line 201 which uses `guessSubject(prompt)` → use `opts.subject || guessSubject(prompt)`), `buildRubric` (line 231), `buildActivity` (line 247):

```js
function buildLesson(prompt, parsed, opts = {}) {
  // ... unchanged body ...
  subject: opts.subject || guessSubject(prompt),
```

For `buildQuiz`, the current signature is `function buildQuiz(prompt, parsed, prefs)` (line 128) — change to `function buildQuiz(prompt, parsed, opts = {}, prefs)` and set `subject: opts.subject || guessSubject(prompt)`. The call site in Step 1 passes `({ subject }, prefs)`.

The slides first-slide subtitle (line 201) currently reads `subtitle: parsed.grade + ' · ' + guessSubject(prompt)` — change to `parsed.grade + ' · ' + (opts.subject || guessSubject(prompt))`.

- [ ] **Step 3: Add override passthrough to `src/services/api.js`**

Change `generate` (line 19):

```js
  async generate({ prompt, types, quizOpts, level, subject }) {
    await wait(randomLatency());
    const items = generateItems(prompt, types, quizOpts, { level, subject });
    STORE.recordGeneration(items.length);
    return items;
  },
```

- [ ] **Step 4: Write verification script `scripts/verify-generator-overrides.mjs`**

```js
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
```

- [ ] **Step 5: Run the verification script**

Run: `node scripts/verify-generator-overrides.mjs`
Expected: `verify-generator-overrides: PASS`.

- [ ] **Step 6: Syntax + build check, commit**

Run: `node --check src/data/generator.js; node --check src/services/api.js; if ($?) { npm.cmd run build }`
Expected: both OK; build exit 0, no warnings.

```bash
git add src/data/generator.js src/services/api.js scripts/verify-generator-overrides.mjs
git commit -m "feat: accept level & subject overrides in generation engine"
```

---

### Task 3: Single-type page state + AppContext cleanup

**Files:**
- Modify: `src/pages/GeneratorPage.jsx`
- Modify: `src/context/AppContext.jsx`
- Modify: `src/pages/DashboardPage.jsx`
- Check: `scripts/verify-level-subject.mjs` (re-run; unchanged)

**Interfaces:**
- Consumes: `LEVELS`, `SUBJECTS`, `levelLabel` (Task 1); `useApp().user`, `pendingPrompt`, `setPendingPrompt`, `quizKinds`, `setQuizKinds`, `quizCount`, `setQuizCount` (existing AppContext).
- Produces: page behavior — radio single-select (default `lesson`), level+subject selects, single-item navigation. Removes `pendingAllTypes`/`setPendingAllTypes` everywhere.

- [ ] **Step 1: Remove `pendingAllTypes` from `src/context/AppContext.jsx`**

Delete the line `const [pendingAllTypes, setPendingAllTypes] = useState(false);` (line 10) and its entries in the provider value object (lines 39-40). Do not touch any other context fields.

- [ ] **Step 2: Remove `setPendingAllTypes` usage in `src/pages/DashboardPage.jsx`**

In `DashboardPage.jsx` line 16, drop `setPendingAllTypes` from the `useApp()` destructure. Delete `setPendingAllTypes(true);` on line 228 (the suggestion-click handler keeps `setPendingPrompt(s.prompt);` and `navigate("/generator");`).

- [ ] **Step 3: Rewrite GeneratorPage type selection for radio semantics**

In `src/pages/GeneratorPage.jsx`:
- Line 23-29 destructure: remove `selectedTypes, setSelectedTypes, toggleType, pendingAllTypes, setPendingAllTypes`; keep `user, pendingPrompt, setPendingPrompt, quizKinds, setQuizKinds, quizCount, setQuizCount`. Add `user` and the `lang` from `useI18n` (already have `t`).
- Replace lines 22-25 with local state:

```js
  const [selectedType, setSelectedType] = useState(() =>
    routeType && TYPE_ORDER.includes(routeType) ? routeType : 'lesson'
  );
  const [level, setLevel] = useState('p4');
  const [subject, setSubject] = useState(() =>
    user && SUBJECTS.some(s => s.value === user.subject) ? user.subject : 'Science'
  );
```

- Delete the `useEffect` at lines 36-43 (route/pendingAllTypes effect) entirely.
- Update the tab render (lines 128-140): use `selectedType === type` for `selected`, and `onClick={() => setSelectedType(type)}`.
- Update `summary` (lines 58-60) to fixed text: `t('gen.summary')`.

- [ ] **Step 4: Add the level + subject selectors row**

In the JSX, after the prompt card `</div>` (line 118) and before the `<h2 ...>{t('gen.typesTitle')}</h2>` (line 120), insert:

```jsx
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center mb-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="gen-level" className="text-sm font-medium text-muted">{t('gen.levelLabel')}</label>
          <select id="gen-level" className="input sm:w-48" value={level} onChange={e => setLevel(e.target.value)}>
            {LEVELS.map(lv => (
              <option key={lv.value} value={lv.value}>{levelLabel(lv.value, lang)}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="gen-subject" className="text-sm font-medium text-muted">{t('gen.subjectLabel')}</label>
          <select id="gen-subject" className="input sm:w-48" value={subject} onChange={e => setSubject(e.target.value)}>
            {SUBJECTS.map(s => (
              <option key={s.value} value={s.value}>{t(s.key)}</option>
            ))}
          </select>
        </div>
      </div>
```

- Imports: add `LEVELS, SUBJECTS, levelLabel` from `../data/types.js`; add `user` to the `useApp()` destructure; ensure `lang` is destructured from `useI18n()` (change `const { t } = useI18n();` → `const { t, lang } = useI18n();`).

- [ ] **Step 5: Update quiz panel + doGenerate for single type**

- Quiz panel condition (line 145): `selectedTypes.has('quiz')` → `selectedType === 'quiz'`.
- `doGenerate` (lines 64-97):
  - guards: drop the `!selectedTypes.size` block guard is fine to keep as-is BUT types now always has 1 — replace with `const types = [selectedType];` and keep the `quiz → quizKinds` check (unchanged).
  - payload line 87: `const quizOpts = { count: Number(quizCount), kinds: quizKinds };` then `const items = await API.generate({ prompt: value, types, quizOpts, level, subject });`
  - lines 88-91: simplify to:
    ```js
    const item = items[0];
    Live.put(item);
    navigate('/content/' + item.id);
    ```
  - `ctaLabel` (line 62) unchanged (uses `t('gen.cta')` now singular from Task 1).

- [ ] **Step 6: Verify page compiles, build, commit**

Run: `npm.cmd run build`
Expected: build exit 0, no warnings; the tab strip no longer references `selectedTypes`, `toggleType`, or `pendingAllTypes` (grep for those names in `src/` → only AppContext deletion should leave zero matches).

```bash
git add src/pages/GeneratorPage.jsx src/context/AppContext.jsx src/pages/DashboardPage.jsx
git commit -m "feat: generator single-type selection with level & subject selectors"
```

---

### Task 4: Full verification pass

**Files:**
- Run-only (no source changes unless a check fails).

**Interfaces:**
- Consumes: all prior tasks.

- [ ] **Step 1: Re-run both Node verification scripts**

Run: `node scripts/verify-level-subject.mjs; node scripts/verify-generator-overrides.mjs`
Expected: both PASS.

- [ ] **Step 2: Confirm no stale references**

Run: `Select-String -Path "src\*.jsx","src\*.js" -Pattern "pendingAllTypes|selectedTypes|toggleType|_bundle" -Recurse | Select-Object Path,LineNumber,Line` (from repo root; PowerShell)
Expected: zero matches for `pendingAllTypes`/`selectedTypes`/`toggleType`/`_bundle`.

- [ ] **Step 3: i18n key parity spot-check**

Run: `node -e "import('./src/services/i18n.js').then(({DICT})=>{const ks=['gen.cta','gen.sub','gen.summary','gen.levelLabel','gen.subjectLabel','gen.subjectPhysics','gen.subjectChemistry','gen.subjectBiology','gen.subjectHistory','gen.subjectGeography','gen.subjectComputing'];let bad=ks.filter(k=>!DICT.en[k]||!DICT.th[k]);if(bad.length){console.error('missing',bad);process.exit(1)};console.log('i18n parity: PASS')})"`
Expected: `i18n parity: PASS`.

- [ ] **Step 4: Build + preview note**

Run: `npm.cmd run build`
Expected: exit 0, no warnings. Note to reviewer: manual `npm.cmd run preview` walkthrough is recommended — radio-switch tabs (one always selected), level/subject pre-fill from login profile, quiz panel toggles with quiz type, single-item navigation to content.

- [ ] **Step 5: Final commit (only if any fix was needed in this task)**

If Steps 1-4 reveal a regression, fix it, re-run, then:

```bash
git add -A
git commit -m "fix: generator verification adjustments"
```

If all clean, make no commit here (previous task commits already capture the work).

---

## Self-Review Notes

- **Spec coverage:** Section 1 → Task 1; Section 3 → Task 2; Section 2 → Task 3; Section 4 → Task 4. The five decision bullets (radio switch, dashboard default, level list, subject list, override, defaults) are each addressed in the stated task. `pendingAllTypes` removal touches all three consumers (AppContext, DashboardPage, GeneratorPage) in Task 3.
- **Placeholder scan:** Every code step contains concrete code; no TBD/TODO; the two `...` ellipses inside builder bodies mark unchanged-in-between sections, not omissions of required code.
- **Type consistency:** `generateItems(prompt, types, quizOpts, opts)` matches api.js call `generateItems(prompt, types, quizOpts, { level, subject })`; `buildQuiz(prompt, parsed, opts = {}, prefs)` call passes `({ subject }, prefs)`; `levelLabel(value, lang)`, `LEVELS`, `SUBJECTS` names identical across Tasks 1-3. `selectedType` (string) is used consistently in Task 3; no leftover `selectedTypes`/`toggleType` in any step.