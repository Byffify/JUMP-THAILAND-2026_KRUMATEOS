# Slideshow View for Curriculum Slides

Date: 2026-08-15
Status: Approved

## Problem

The current slides renderer (`renderSlides` in `src/components/ItemRenderers.jsx`) displays
all slides in a 2-column grid of `aspect-[4/3]` cards. For the 144 MOE curriculum slide
templates, the intended presentation is a real slide deck: one slide at a time, 16:9, with
prev/next navigation. The user also wants "Save as Image" to be able to capture all slides
in a single tall image.

## Decisions (confirmed with user)

- **Approach A**: A slideshow view lives in ContentView, replaces the grid as the default
  view for `type === 'slides'` items, with a button to toggle back to the old grid.
- Single slide at a time, 16:9 aspect ratio, centered.
- Prev/next buttons, page counter, progress indicator.
- Keyboard navigation (arrows / PageUp / PageDown), ignored while focus is in an input.
- "Save as Image" in slideshow mode captures **all slides** stacked vertically into one
  image (a contact sheet). In grid mode it behaves as today.

## Architecture

### New component: `src/components/SlideshowView.jsx`

Props: `{ item, lang }`.

- Holds internal state `index` (0-based), `view` (`'show' | 'grid'`).
- Default `view` is `'show'` for slides items.
- Renders:
  - Slideshow area: single slide, `aspect-video` (16:9), centered, decorative background.
  - Controls: ◀ / ▶ buttons (disabled at first/last), counter `"02 / 06"`, progress bar
    (dots or bar).
  - A toggle button ("ดูแบบรวม" / "Slideshow") to switch `view` between `'show'` and `'grid'`.
  - In `'grid'` mode, renders the existing grid layout (current `renderSlides` markup).
- Keyboard listener on the window for ArrowLeft/ArrowRight/PageUp/PageDown that advances
  `index`, skipping when `document.activeElement` is an input/textarea/select or the toggle
  is not in show mode.
- The **slide visual design** (from the earlier "make slides prettier" discussion):
  - Keep the `{th,en}` localization via `loc()` and `lang` as today.
  - Improve the single-slide layout with gradient backgrounds and clearer typography,
    reusing existing design tokens (`--primary #FAAA48`, `--peach #FFDDAC`,
    `--dark #2F0F03`, `--cream`, `--line`, `--soft`) and Tailwind utility classes already
    in the project. No new CSS file unless required.
  - Slide shows: slide number, subtitle (e.g. indicator line), title, bullets.

### ContentViewPage changes: `src/pages/ContentViewPage.jsx`

- For `item.type === 'slides'`, render `<SlideshowView item={item} lang={lang} />` instead
  of `renderItemBody(item, lang)`.
- All other types keep using `renderItemBody`.

### Renderer refactor: `src/components/ItemRenderers.jsx`

- `renderSlides(item, lang)` is retained and reused as the grid view inside
  `SlideshowView` (the toggle "ดูแบบรวม" shows it). No existing export removed.

### Export: `src/utils/export.js` — `exportAsImage`

- In slideshow mode the "Save as Image" button must capture ALL slides as one tall image.
- Implementation: build a temporary off-screen container (absolutely positioned off-screen,
  e.g. `position: fixed; left: -9999px`) containing all slides stacked vertically at a
  fixed width (e.g. 1280px), with the same slide markup/styling used in slideshow mode
  (full 16:9 slides, one after another), then `html2canvas(element, { scale: 2, useCORS,
  backgroundColor: '#ffffff' })` on that container, download as PNG, then remove the
  temporary node.
- The `contentBodyRef` path stays for non-slides items and for grid mode.
- This is a port/extension of the existing `exportAsImage` behavior; keep its toast
  messages and error handling.

## Data Flow

- ContentViewPage resolves the item via `STORE.find(id)` (which already falls back to
  curriculum templates with `isTemplate: true`), then routes slides items to
  `SlideshowView`.
- SlideshowView keeps `index` locally; no store changes.
- The save/copy/download/print/export buttons in ContentViewPage are untouched and continue
  to operate on the whole item (their own helpers in `export.js`).

## Error Handling

- `exportAsImage`: keep existing try/catch + toasts (`กำลังสร้างรูปภาพ...`, success,
  failure). The temporary container must be removed in `finally` so failed captures never
  leak a hidden node.
- Slideshow: guard against `item.slides` empty (defensive `[]`).

## Testing

Manual (no test framework):
1. Open a slides template (e.g. Math ป.1) → slideshow shows slide 1 of N, counter correct.
2. ◀ ▶ and arrow keys navigate; disabled at first/last; PageUp/PageDown work.
3. Typing in any input does not trigger slide navigation.
4. "ดูแบบรวม" toggles to the old grid and back.
5. EN ↔ ไทย: slide content switches live (uses `lang`/`loc`).
6. Save to Library → open saved copy → slideshow works.
7. "Save as Image" in slideshow mode downloads ONE tall PNG containing all slides.
8. "Save as Image" in grid mode still captures the whole page as before.
9. Non-slides items (lesson/worksheet/quiz/rubric/activity) render unchanged.

## Out of Scope

- Fullscreen modal / PowerPoint-style overlay (Approach B) — future.
- Auto-play / timer / transition animations.
- Per-subject theme colors — future enhancement.
- No changes to `store.js`, `i18n.js`, or the template data files.