# Generator: single-type + study level & subject selectors — Design

Date: 2026-08-11
Repo: `JUMP-THILAND-2026-KRUMATEOS` (React 18 + Vite + Tailwind v3 migration of KruMate OS)
Supersedes (for the Generator page only): the multi-type bundle behavior from the migration.

## Purpose

Earlier the generator allowed selecting multiple output types (Set + toggle) and produced a
multi-material `_bundle` from one prompt. Two behavior changes are requested:

1. **Only one output type at a time** — radio-style switching, exactly one selected at all times.
2. **Explicit study-level and subject selectors** — the generated material uses the chosen level +
   subject instead of regex/keyword-sniffing them from the prompt text.

## Decisions (from brainstorming, user-confirmed)

- **Approach A:** GeneratorPage owns all new state locally. `AppContext` loses the dead
  `pendingAllTypes` field; dashboard suggestions just pre-fill the prompt (already works) and the
  page defaults to one type.
- **Type switching:** radio-style. Clicking a tab replaces the selection; never 0 selected.
- **Arriving from dashboard suggestion:** pre-select a single sensible default (`lesson`), not all six.
- **Level options:** full 13-level Thai list — อนุบาล, ป.1–ป.6, ม.1–ม.6 (value keys `k`, `p1`..`p6`, `m1`..`m6`).
- **Subject options:** 12 subjects — the 6 existing login subjects + ฟิสิกส์/เคมี/ชีววิทยา/ประวัติศาสตร์/ภูมิศาสตร์/คอมพิวเตอร์
  (Physics, Chemistry, Biology, History, Geography, Computing).
- **Default pre-fill:** level defaults to `p4` (ป.4 / Grade 4); subject pre-fills from the logged-in
  user's `user.subject` when it is one of the 12, else `Science`.
- **Output effect:** UI level + subject override the prompt-derived grade/subject on generated items.
  Without them (bare `generateItems` call or legacy fallback), old sniffing behavior is preserved.
- **CTA/summary:** singular wording — "Generate" / "สร้างเลย", fixed summary text (no `{n}`).
- **No new persistence keys:** items already carry `grade`/`subject`.

## Section 1 — Data + i18n

**`src/data/types.js`** — add exports (alongside `TYPE_ORDER`):

```js
export const LEVELS = [
  { value: 'k',    label: { en: 'Kindergarten', th: 'อนุบาล' } },
  { value: 'p1',   label: { en: 'Grade 1', th: 'ชั้น ป.1' } },
  { value: 'p2',   label: { en: 'Grade 2', th: 'ชั้น ป.2' } },
  { value: 'p3',   label: { en: 'Grade 3', th: 'ชั้น ป.3' } },
  { value: 'p4',   label: { en: 'Grade 4', th: 'ชั้น ป.4' } },
  { value: 'p5',   label: { en: 'Grade 5', th: 'ชั้น ป.5' } },
  { value: 'p6',   label: { en: 'Grade 6', th: 'ชั้น ป.6' } },
  { value: 'm1',   label: { en: 'M.1',     th: 'ชั้น ม.1' } },
  { value: 'm2',   label: { en: 'M.2',     th: 'ชั้น ม.2' } },
  { value: 'm3',   label: { en: 'M.3',     th: 'ชั้น ม.3' } },
  { value: 'm4',   label: { en: 'M.4',     th: 'ชั้น ม.4' } },
  { value: 'm5',   label: { en: 'M.5',     th: 'ชั้น ม.5' } },
  { value: 'm6',   label: { en: 'M.6',     th: 'ชั้น ม.6' } },
];

export const SUBJECTS = [
  { value: 'Science',         key: 'login.subjectScience' },
  { value: 'Mathematics',     key: 'login.subjectMath' },
  { value: 'Thai',            key: 'login.subjectThai' },
  { value: 'English',         key: 'login.subjectEnglish' },
  { value: 'Social Studies',  key: 'login.subjectSocial' },
  { value: 'Other',           key: 'login.subjectOther' },
  { value: 'Physics',         key: 'gen.subjectPhysics' },
  { value: 'Chemistry',       key: 'gen.subjectChemistry' },
  { value: 'Biology',         key: 'gen.subjectBiology' },
  { value: 'History',         key: 'gen.subjectHistory' },
  { value: 'Geography',       key: 'gen.subjectGeography' },
  { value: 'Computing',       key: 'gen.subjectComputing' },
];
export const levelLabel = (value, lang) => (LEVELS.find(l => l.value === value) || {}).label?.[lang] || '';
```

**`src/services/i18n.js`** — add to BOTH `en` and `th` dicts:
- `gen.subjectPhysics` → Physics / ฟิสิกส์
- `gen.subjectChemistry` → Chemistry / เคมี
- `gen.subjectBiology` → Biology / ชีววิทยา
- `gen.subjectHistory` → History / ประวัติศาสตร์
- `gen.subjectGeography` → Geography / ภูมิศาสตร์
- `gen.subjectComputing` → Computing / คอมพิวเตอร์
- `gen.levelLabel` → "Study level" / "ระดับชั้น"
- `gen.subjectLabel` → "Subject" / "วิชา"
- Update `gen.cta` to singular: "Generate" / "สร้างเลย"; `gen.sub` wording can stay.
- Update `gen.sub` to singular copy too: e.g. en "Write a prompt, pick one output type, and generate your material." / th "เขียนคำสั่ง เลือกประเภทผลงาน 1 ประเภท แล้วสร้างสื่อของคุณ"
- `gen.summary` fixed text (no interpolation) or keep key with fixed copy.
- `gen.summaryEmpty` becomes unreachable (a type is always selected); may be left in DICT (harmless) or dropped.

## Section 2 — GeneratorPage (page logic)

All new form state is local `useState`; no `AppContext` additions:

- `const [selectedType, setSelectedType] = useState(() => routeType && TYPE_ORDER.includes(routeType) ? routeType : 'lesson');`
- `const [level, setLevel] = useState('p4');`
- `const [subject, setSubject] = useState(() => user?.subject && SUBJECTS.some(s => s.value === user.subject) ? user.subject : 'Science');`
  (`user` from `useApp().user`.)

Behavior:
- Fetch current lang via `useI18n().lang` for level labels.
- Tab click → `setSelectedType(t)` (replace). Remove `selectedTypes`/`toggleType` usage; remove the
  route-param `useEffect` and the `pendingAllTypes` effect (only initial state reads `routeType`).
- Remove `pendingAllTypes` from AppContext and DashboardPage (`setPendingAllTypes(true)` call deleted).
- New selectors row (below prompt card, above types), `.input` select styling like `#login-subject`:
  - Study level select: `<option>` per LEVELS, label via `levelLabel(lv.value, lang)`.
  - Subject select: `<option>` per SUBJECTS, label via `t(s.key)`.
  - `flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center`; stack on mobile.
- Summary text: fixed, no `{n}`.
- CTA: `'✨ ' + t('gen.cta')` stays, caption now singular.
- Generate flow:
  - guards unchanged (prompt empty, type always present, quiz→quizKinds check);
  - `types = [selectedType]`;
  - payload `{ prompt, types, quizOpts, level, subject }`;
  - `API.generate(...)` → `Live.put` the single item → `navigate('/content/' + item.id)`.
  - No `_bundle`, no `items.forEach`, no `items.length > 1` branch.
  - Quiz panel `#quiz-options` visibility keyed to `selectedType === 'quiz'`.

## Section 3 — Engine plumbing (generator.js → api.js)

**`src/data/generator.js`:**
- `generateItems(prompt, types, quizOpts, opts)` — new optional 4th arg `{ level, subject }`.
- Add module helper `levelGrade(value, lang)` → label string (reuses LEVELS via `levelLabel`), appended
  inside `parsePrompt` result as the override when `opts.level` present.
- Each `build*` currently sets `grade: parsed.grade` and `subject: guessSubject(prompt)`. When
  `opts.level` provided, set `grade` from the LEVELS label instead; when `opts.subject` provided,
  set `subject` to it. Otherwise keep existing sniffing (parity fallback).
- Pass `parsed` (or `opts`) into each `build*`; minimal signature change — `build*(prompt, parsed, extra)`.

**`src/services/api.js`:**
- `generate({ prompt, types, quizOpts, level, subject })` → `generateItems(prompt, types, quizOpts, { level, subject })`.
- Additive only; swap-point contract preserved.

**Unchanged:** `store.js`; `src/services/format.js`; every item type's requirement, data keys stay.

## Section 4 — Verification

- `npm.cmd run build` — exit 0, no warnings.
- `node --check` on modified plain-JS files (types.js, generator.js, api.js, i18n.js).
- Determinism/override check (Node, ESM import):
  - `generateItems('Create a lesson about solar system', ['lesson'], {count:0}, {level:'p6', subject:'Science'})`
    → `item.grade` is the p6 label, `item.subject === 'Science'`.
  - Same call with no 4th arg → values equal the old sniffed ones (parity fallback intact).
- i18n key check: every key referenced (subject/new/level labels) exists in BOTH dicts (node loop).
- Manual preview (`npm.cmd run preview`): radio switch (one always selected), pre-fill from profile,
  quiz panel visibility, single-item navigation to content.

## Out of scope (YAGNI)

- Multi-material bundles / `_bundle` (removed for this flow).
- Persisting selected level/subject across sessions (no new localStorage keys).
- Expanding levels beyond the 13 Thai bands.