# Slideshow View Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the grid rendering for slides items with a real 16:9 slideshow view (one slide at a time, prev/next, keyboard nav, grid toggle) in ContentView, and make "Save as Image" capture all slides in one tall image.

**Architecture:** New `SlideshowView` component renders the slideshow and, on toggle, the existing grid (`renderSlides`). A shared `renderSlideCard` produces the prettier 16:9 slide markup used by both the slideshow and an off-screen capture container that `exportAsImage` captures. ContentViewPage routes slides items to the new component.

**Tech Stack:** React 18, Vite 5, Tailwind CSS 3, html2canvas (already a dependency), localStorage store.

## Global Constraints

- No test framework in the repo. Verification = `node scripts/verify-curriculum.mjs` (unchanged, must stay PASS 144) + `& npm.cmd run build` (must succeed) + manual browser checks.
- Windows PowerShell, no bash. `npm run build` is blocked by execution policy; use `& npm.cmd run build`.
- Keep all existing design tokens and Tailwind utility classes (`--primary #FAAA48`, `--peach #FFDDAC`, `--dark #2F0F03`, `--cream`, `--line`, `--soft`). No new CSS file.
- Do NOT modify `src/services/store.js`, template data files, or `src/data/curriculum/*`.
- i18n: every new user-facing string gets an `en` + `th` key in `src/services/i18n.js` (en block ~lines 60–145, th block ~lines 238–323). New strings are grouped under the `slideshow.*` prefix.
- All new/changed user-facing copy must exist in both languages.

---

### Task 1: i18n keys for slideshow controls

**Files:**
- Modify: `src/services/i18n.js` (en block after the `content.*` group; th block after the `content.*` group)

**Interfaces:**
- Produces: keys `slideshow.viewGrid`, `slideshow.viewShow`, `slideshow.prev`, `slideshow.next` used by `SlideshowView`.

- [ ] **Step 1: Add the four English keys**

Add right after the `content.*` keys in the English block (after `'content.toastDownloaded': 'Downloaded as text file',`):

```js
'slideshow.viewGrid': 'View all',
'slideshow.viewShow': 'Slideshow',
'slideshow.prev': 'Previous',
'slideshow.next': 'Next',
```

- [ ] **Step 2: Add the four Thai keys**

Add right after the `content.*` keys in the Thai block (after `'content.toastDownloaded': 'ดาวน์โหลดเป็นไฟล์ข้อความแล้ว',`):

```js
'slideshow.viewGrid': 'ดูแบบรวม',
'slideshow.viewShow': 'สไลด์โชว์',
'slideshow.prev': 'ก่อนหน้า',
'slideshow.next': 'ถัดไป',
```

- [ ] **Step 3: Verify build**

Run: `& npm.cmd run build`
Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/services/i18n.js
git commit -m "feat(i18n): add slideshow control strings"
```

---

### Task 2: Shared 16:9 slide card in ItemRenderers

**Files:**
- Modify: `src/components/ItemRenderers.jsx` (add `renderSlideCard` near `renderSlides`, ~line 200; keep `renderSlides` untouched)

**Interfaces:**
- Consumes: `loc(v, lang)` already defined at the top of the file.
- Produces: `export function renderSlideCard(s, i, lang)` returning a single 16:9 styled slide `<div>`. Used by `SlideshowView` (visible slide + capture container).

- [ ] **Step 1: Add the exported function**

Add this function just above `export function renderSlides(item, lang) {` (line 202). Do not touch `renderSlides`.

```jsx
export function renderSlideCard(s, i, lang) {
  const dark = i % 2 === 1;
  return (
    <div
      key={i}
      className={
        'relative aspect-video rounded-3xl overflow-hidden p-8 sm:p-12 flex flex-col justify-between ' +
        (dark
          ? 'bg-gradient-to-br from-dark via-[#3A1A08] to-[#2F0F03] text-white'
          : 'bg-gradient-to-br from-cream via-[#FFF6EA] to-peach/50 border border-line')
      }
    >
      <div className="flex items-center justify-between">
        <span className={'text-xs font-semibold ' + (dark ? 'text-white/50' : 'text-muted')}>
          {String(i + 1).padStart(2, '0')}
        </span>
        <span className={'w-10 h-10 ' + (dark ? 'bg-primary/25' : 'bg-primary/15') + ' rounded-xl'}></span>
      </div>
      <div className="max-w-3xl">
        {s.subtitle && (
          <p className="text-xs sm:text-sm mb-2 font-medium text-primary">{loc(s.subtitle, lang)}</p>
        )}
        <h3 className="font-semibold text-2xl sm:text-4xl leading-snug mb-4">{loc(s.title, lang)}</h3>
        {s.bullets.length > 0 && (
          <ul className={'space-y-2 sm:space-y-3 text-sm sm:text-lg ' + (dark ? 'text-white/85' : 'text-muted')}>
            {s.bullets.map((b, j) => (
              <li key={j} className="flex gap-3">
                <span className="text-primary shrink-0">•</span>
                <span>{loc(b, lang)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
```

Note: Tailwind scans `.jsx` files, so the arbitrary values (`via-[#3A1A08]`, `to-[#2F0F03]`, `via-[#FFF6EA]`, `to-peach/50`) are generated at build time.

- [ ] **Step 2: Verify build**

Run: `& npm.cmd run build`
Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/ItemRenderers.jsx
git commit -m "feat(render): add shared 16:9 slide card component"
```

---

### Task 3: SlideshowView component

**Files:**
- Create: `src/components/SlideshowView.jsx`

**Interfaces:**
- Consumes:
  - `renderSlideCard(s, i, lang)` and `renderSlides(item, lang)` from `./ItemRenderers.jsx` (Tasks 2 / existing).
  - `useI18n` from `../context/I18nContext.jsx` (existing).
  - Keys `slideshow.*` from Task 1.
- Produces: default-exported `<SlideshowView item={item} lang={lang} captureRef={captureRef} />`.
  - `captureRef` is a `useRef` created by the parent that will be attached to the off-screen capture container (`id="slide-capture"`).

- [ ] **Step 1: Create the component**

```jsx
/* ==========================================================================
   KruMate OS — SlideshowView
   Single-slide 16:9 slideshow for type==='slides' items, with a toggle to
   the grid view and an off-screen all-slides container for image export.
   ========================================================================== */
import { useEffect, useRef, useState } from 'react';
import { renderSlideCard, renderSlides } from './ItemRenderers.jsx';
import { useI18n } from '../context/I18nContext.jsx';

export default function SlideshowView({ item, lang, captureRef }) {
  const { t } = useI18n();
  const total = (item.slides || []).length;
  const [index, setIndex] = useState(0);
  const [view, setView] = useState('show');
  const go = n => setIndex(Math.max(0, Math.min(n, total - 1)));

  useEffect(() => {
    setIndex(0);
  }, [item.id]);

  useEffect(() => {
    if (view !== 'show') return;
    const onKey = e => {
      const el = document.activeElement;
      if (el && ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') go(Math.min(index + 1, total - 1));
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(Math.max(index - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view, index, total]);

  if (total === 0) return null;

  if (view === 'grid') {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <button className="btn btn-secondary text-sm" onClick={() => setView('show')}>
            {t('slideshow.viewShow')}
          </button>
        </div>
        {renderSlides(item, lang)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button className="btn btn-secondary text-sm" onClick={() => setView('grid')}>
          {t('slideshow.viewGrid')}
        </button>
      </div>

      <div className="bg-soft/60 rounded-3xl p-4 sm:p-10">
        <div className="max-w-4xl mx-auto">{renderSlideCard(item.slides[index], index, lang)}</div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button className="btn btn-secondary" disabled={index === 0} onClick={() => go(index - 1)}>
          ◀ {t('slideshow.prev')}
        </button>
        <span className="text-sm text-muted font-medium tabular-nums">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <button className="btn btn-secondary" disabled={index === total - 1} onClick={() => go(index + 1)}>
          {t('slideshow.next')} ▶
        </button>
      </div>

      <div className="flex justify-center gap-1.5">
        {item.slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={'w-2.5 h-2.5 rounded-full ' + (i === index ? 'bg-primary' : 'bg-line')}
          />
        ))}
      </div>

      <div
        id="slide-capture"
        ref={captureRef}
        style={{ position: 'fixed', left: '-9999px', top: 0, width: '1280px', background: '#ffffff', zIndex: -1 }}
        aria-hidden="true"
      >
        {item.slides.map((s, i) => (
          <div key={i} className="p-8">{renderSlideCard(s, i, lang)}</div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `& npm.cmd run build`
Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/SlideshowView.jsx
git commit -m "feat(content): add slideshow view component"
```

---

### Task 4: Route slides items in ContentViewPage + export capture

**Files:**
- Modify: `src/pages/ContentViewPage.jsx` (imports at lines 1–13, state at lines 20–25, body at line 91, export button at lines 86–88)
- Modify: `src/utils/export.js` (html2canvas options at lines 128–134)

**Interfaces:**
- Consumes: `SlideshowView` from Task 3; `renderItemBody` (existing).
- Produces: `exportAsImage(captureRefOrBodyRef, item, toast)` — same signature as today; ContentViewPage passes the right ref per item type.

- [ ] **Step 1: Import SlideshowView in ContentViewPage**

Change the import at line 12:

```jsx
import { renderItemBody } from '../components/ItemRenderers.jsx';
```
to:
```jsx
import SlideshowView from '../components/SlideshowView.jsx';
import { renderItemBody } from '../components/ItemRenderers.jsx';
```

- [ ] **Step 2: Add a capture ref**

Add `const captureRef = useRef(null);` after `const contentBodyRef = useRef(null);` (line 22).

- [ ] **Step 3: Route slides items to SlideshowView**

Replace line 91:

```jsx
<div id="content-body" ref={contentBodyRef} className="space-y-6">{renderItemBody(item, lang)}</div>
```
with:
```jsx
<div id="content-body" className="space-y-6">
  {item.type === 'slides' ? (
    <SlideshowView item={item} lang={lang} captureRef={captureRef} />
  ) : (
    <div ref={contentBodyRef}>{renderItemBody(item, lang)}</div>
  )}
</div>
```

Note: for slides items the `contentBodyRef` is intentionally left unset; the capture element lives inside `SlideshowView`.

- [ ] **Step 4: Point the export button at the capture ref for slides**

Replace lines 86–88:

```jsx
<button id="content-export-image" className="btn btn-secondary" onClick={() => exportAsImage(contentBodyRef, item, toast)}>
  {t('content.exportImage') || 'Save as Image'}
</button>
```
with:
```jsx
<button id="content-export-image" className="btn btn-secondary" onClick={() => exportAsImage(item.type === 'slides' ? captureRef : contentBodyRef, item, toast)}>
  {t('content.exportImage') || 'Save as Image'}
</button>
```

- [ ] **Step 5: Teach html2canvas to bring the capture container into view**

In `src/utils/export.js`, replace the `html2canvas` options block (lines 128–134):

```js
const canvas = await html2canvas(element, {
  scale: 2,
  useCORS: true,
  backgroundColor: '#ffffff',
  logging: false,
  onclone: doc => {
    const el = doc.getElementById('slide-capture');
    if (el) {
      el.style.left = '0px';
      el.style.position = 'absolute';
      el.style.top = '0px';
    }
  },
});
```

Rationale: the capture container is rendered off-screen (`left: -9999px`) so it never disturbs layout; html2canvas clones the document, and `onclone` moves the clone back into view before capturing. For non-slides items `#slide-capture` does not exist and the block is a no-op.

- [ ] **Step 6: Verify build**

Run: `& npm.cmd run build`
Expected: succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/pages/ContentViewPage.jsx src/utils/export.js
git commit -m "feat(content): slideshow view for slides items and all-slides image export"
```

---

### Task 5: End-to-end manual verification

**Files:**
- No new files. Manual verification only.

**Interfaces:**
- Consumes: all prior tasks.

- [ ] **Step 1: Run static checks**

Run: `node scripts/verify-curriculum.mjs`
Expected: `PASS (144 templates)`.

Run: `& npm.cmd run build`
Expected: succeeds.

- [ ] **Step 2: Manual checklist** (browser, `& npm.cmd run dev` then visit `/#/library`, open a slides template — e.g. Math ป.1):
  - [ ] Slideshow shows slide 1 of N in a 16:9 card with title, subtitle (indicator line), bullets, slide number, decorative gradient.
  - [ ] ◀ ▶ buttons navigate; disabled at first/last slide; counter shows `01 / 06` style and updates.
  - [ ] Arrow keys / PageUp / PageDown navigate; typing in an input does NOT change slides.
  - [ ] The dots row jumps to any slide; active dot is `bg-primary`.
  - [ ] "ดูแบบรวม" toggle shows the old grid; its "สไลด์โชว์" button returns to the show view.
  - [ ] EN ↔ ไทย switch: slide content and the control labels translate live.
  - [ ] "Save as Image" in slideshow mode downloads ONE tall PNG containing all slides (verify the image shows all 6–8 slides stacked).
  - [ ] "Save as Image" in grid mode still captures the page as before.
  - [ ] Save the template to Library → open the saved copy → slideshow works; badge shows "บันทึกแล้ว".
  - [ ] Non-slides items (lesson/worksheet/quiz/rubric/activity) render exactly as before.

- [ ] **Step 3: Commit any manual-fix changes** (if the checklist surfaced bugs, fix and commit them):

```bash
git add -A
git commit -m "fix(slideshow): address verification findings"
```

- [ ] **Step 4: Update the design doc's verification section** if the manual run revealed plan gaps. Otherwise leave as-is.