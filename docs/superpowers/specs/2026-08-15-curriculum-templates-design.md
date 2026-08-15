# MOE Curriculum Templates in Library — Design

Date: 2026-08-15
Repo: `JUMP-THAILAND-2026_KRUMATEOS` (React 18 + Vite + Tailwind v3, HashRouter)

## Purpose

Add a **MOE Curriculum Templates** (เทมเพลตหลักสูตร สพฐ.) section to the Library page
(`/library`). Teachers can browse pre-made, bilingual (EN/TH) slide templates aligned to the Thai
Ministry of Education core curriculum (หลักสูตรแกนกลาง สพฐ. 2551 / 2560), view them, and save copies
into their own library for editing/printing.

This is **phase 1**: one topic per subject per grade. Later phases expand to 2–3 topics per
subject+grade.

## Decisions (from brainstorming, user-confirmed)

- **Approach A — static template data in code.** Curriculum templates live in `src/data/curriculum/`
  as static modules (mirroring the existing `src/data/types.js` / `src/data/support.js` pattern), not
  in localStorage, not in the user's library.
- **Slides only.** Every template is `type: 'slides'`.
- **Grades:** ป.1–ม.6 only (`p1`–`m6`). Kindergarten (`k`) excluded (separate curriculum).
- **Subjects:** the 12 existing `SUBJECTS` from `src/data/types.js` (Science, Mathematics, Thai,
  English, Social Studies, Other, Physics, Chemistry, Biology, History, Geography, Computing).
- **1 topic per subject × grade** = 12 × 12 = **144 templates** in phase 1.
- **Bilingual content:** every slide field stored as `{ th, en }`; rendered per current app language.
- **ตัวชี้วัด (indicators):** each template carries real สพฐ. indicators, shown as chips on the card.
- **Library UI:** a tab switcher on the Library page — "My materials" (existing grid unchanged) vs
  "MOE Curriculum Templates". Templates have no delete button and never mix into the user's grid until
  saved.
- **Save to library:** the content view shows a "Save to library" action for templates that clones the
  template into the user's library under a fresh id (editable, deletable, independent copy).

## Section 1 — Architecture & files

- **`src/data/curriculum/index.js`** — aggregates per-subject files; exports `TEMPLATES`,
  `findTemplateById(id)`.
- **`src/data/curriculum/<Subject>.js`** — 12 files, one per subject, 12 entries each
  (`Math.js`, `Science.js`, `Thai.js`, `English.js`, `SocialStudies.js`, `Other.js`, `Physics.js`,
  `Chemistry.js`, `Biology.js`, `History.js`, `Geography.js`, `Computing.js`).
- **`src/services/store.js`** — extend `STORE.find(id)` to fall back to curriculum templates after
  library + Live.
- **`src/pages/LibraryPage.jsx`** — tab switcher; template grid with its own search + subject + grade
  filters; template cards show indicator chips; no delete button for templates.
- **`src/components/ItemRenderers.jsx`** — `renderSlides` resolves `{th,en}` fields by current
  language while staying backward-compatible with single-language user items.
- **`src/pages/ContentViewPage.jsx`** — for template items show "Save to library" (clones with new id);
  existing copy/print/download/export keep working.
- **`src/services/i18n.js`** — new UI-chrome keys (`lib.*` template tab/filters/save) in `en` and `th`.
- **`src/components/TemplateCard.jsx`** — presentational card for a curriculum template (image, chip,
  title, subject·grade, indicator chips, open button). Optional extraction if LibraryPage grows too
  large; otherwise inline.

## Section 2 — Data model (`src/data/curriculum/`)

```js
{
  id: 'moe-math-p1-01',              // stable unique id
  type: 'slides',
  subject: 'Mathematics',            // matches SUBJECTS values in types.js
  grade: 'p1',                       // matches LEVELS values
  topic: { th: 'การนับและการบวกจำนวนนับ', en: 'Counting and Addition of Whole Numbers' },
  indicators: ['ค1.1 ป.1/1', 'ค1.1 ป.1/2'],   // สพฐ. standard/indicator codes
  outline: [{ th: '...', en: '...' }],
  slides: [
    { title: { th, en }, subtitle: { th, en }, bullets: [{ th, en }, ...] }
  ]   // 5–8 slides per template
}
```

- Field names for slides match the existing `slides` type shape (`title`, `subtitle`, `bullets`), so
  `renderSlides` renders them as-is after language resolution.
- `outline` kept for parity with generated slides items; rendered slides come from `slides[]`.
- Subject/grade values reuse `SUBJECTS`/`LEVELS` so Library filters and i18n labels work unchanged.

## Section 3 — Library page layout & behavior (`LibraryPage.jsx`)

- **Tab switcher** below the page header: "My materials" | "MOE Curriculum Templates" (React state).
  - My materials tab = current grid + search/category/subject/type filters + delete (unchanged).
  - Template tab = template-specific UI.
- **Template tab filters:** search box (matches topic th/en, subject, indicators), subject dropdown
  (12 subjects), grade dropdown (ป.1–ม.6).
- **Template card:** slides asset image, chip "Template สพฐ." / `type.slides`, topic title (current
  language), `subject · grade`, indicator chips (small, truncated with ellipsis if long), Open button
  → `/content/<id>`. No delete button.
- **Empty states:** no matches → "no templates match"; templates always exist (static data), so no
  fully-empty state.
- **Disclaimer note** (small muted line under the header): "เนื้อหาตัวชี้วัดรวบรวมตามหลักสูตร สพฐ.
  ควรตรวจทานกับฉบับทางการก่อนนำไปใช้" / English equivalent.

## Section 4 — Open & save flow

- `STORE.find(id)` order: user library → Live → `findTemplateById(id)`. So `/content/:id` renders
  template items with no changes to ContentViewPage data access.
- ContentViewPage detects a template via `!STORE.itemById(item.id)` plus a flag set by the store
  (`item.isTemplate` added when `find` resolves a curriculum template). For templates the primary
  button reads "Save to library" instead of "Save".
- On save: clone the template, assign a fresh id (`crypto.randomUUID()`), stamp `createdAt`/`updatedAt`,
  `isTemplate: false`, pass to `STORE.save(item)`. The saved copy appears in the user's library, is
  editable/deletable, and the template original is unaffected.
- `renderSlides` uses the current `lang` from `useI18n` to pick `{th,en}` values; single-language user
  items (plain strings) still render unchanged.

## Section 5 — i18n strings (`i18n.js`)

Add to `en` and `th` under the `lib.*` namespace:

- `lib.tabMine` ("My materials" / "เนื้อหาของฉัน")
- `lib.tabTemplates` ("MOE Curriculum Templates" / "เทมเพลตหลักสูตร สพฐ.")
- `lib.templateSearchPh`, `lib.templateAllGrade`, `lib.templateNoResults`
- `lib.templateBadge` ("Template สพฐ.")
- `lib.templateSave` ("Save to library" / "บันทึกเข้า Library")
- `lib.templateDisclaimer` (indicator accuracy note)
- `content.saveTemplate` reuse — check existing `content.save` key and reuse where possible.

## Section 6 — Error handling & edge cases

- No template search matches → `lib.templateNoResults` + the filter controls stay functional.
- Very long indicator lists → chips wrap/truncate with ellipsis; card layout stable.
- Language switch mid-view → renderer re-resolves `{th,en}` from `lang`; no stale text.
- Template saved twice → two independent copies (fresh ids each time); original unaffected.
- User deletes a saved copy → template still browseable in the templates tab.
- `crypto.randomUUID` availability → standard in modern browsers; no fallback needed.

## Section 7 — Verification

- `npm run build` passes (Vite). No test framework configured in this repo, so verification is
  build + manual.
- Manual checklist:
  - Visit `/#/library`; switch EN ↔ ไทย — tab labels, filters, cards translate.
  - Filter templates by subject + grade; search by topic/indicator.
  - Open a template → slides render in current language; switch language → content updates.
  - Click "Save to library" → new copy appears in "My materials"; delete it → template original
    remains in the templates tab.
  - Confirm user-created items still render (single-language backward compatibility).