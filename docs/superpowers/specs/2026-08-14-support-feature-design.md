# Support Center (Teacher's Guide + FAQ) — Design

Date: 2026-08-14
Repo: `JUMP-THAILAND-2026_KRUMATEOS` (React 18 + Vite + Tailwind v3, HashRouter)

## Purpose

Add a **Support** page to KruMate OS containing two sections:

- **Teacher's Guide** — how-to articles for using the product.
- **FAQ** — common questions and answers about generating content and export/technical topics.

The page is reached by URL only (`/support` route) plus a footer link. It is **not** added to the main
nav (user-confirmed).

## Decisions (from brainstorming, user-confirmed)

- **Approach A — data-driven support center.** Guide/FAQ content lives in a data module
  (`src/data/support.js`) with `en`/`th` locale maps, mirroring the existing `src/services/i18n.js`
  DICT pattern. The page renders from data; content is separable from UI.
- **Route:** `/support`, added inside the existing `AppLayout` route (only reachable when logged in,
  consistent with the rest of the app).
- **Discovery:** footer link only; no main-nav item, no mobile-nav item.
- **Language:** Teacher's Guide + FAQ fully translated EN & TH.
- **Guide topics covered:** create an activity, all 6 content types (lesson, worksheet, quiz, slides,
  rubric, activity), library & export, assistant & template mode.
- **FAQ categories covered:** generating content, export & technical.
- **Screenshots:** real screenshots planned, but **placeholder slots for now** — the guide references
  image files under `public/support/*.png`; missing images fall back to a dashed placeholder box
  (via `<img onError>` handling).

## Section 1 — Architecture & files

- **`src/data/support.js`** — guide topics + FAQ items, bilingual `en`/`th` maps, exported helpers:
  `getGuide(lang)`, `getFaq(lang)`, `getGuideById(lang, id)`.
- **`src/pages/SupportPage.jsx`** — `/support` route page: header, search, tabs, guide list + inline
  article expansion, FAQ accordion.
- **`src/components/support/`** — small presentational components:
  - `GuideArticle.jsx` — one article (title, summary, numbered steps, optional screenshots).
  - `FaqItem.jsx` — collapsible accordion row.
  - `SupportTabs.jsx` — tab switcher (reuses `.chip` / button styles).
- **Wiring changes:**
  - `src/App.jsx` — add `/support` route inside the `AppLayout` route.
  - `src/layouts/AppLayout.jsx` — add footer-only link to `/support`.
  - `src/services/i18n.js` — UI-chrome strings under `support.*` in both `en` and `th`.
- **CSS:** reuse existing tokens/utilities (`card`, `.btn`, `.chip`, `.input`). Add only a minor
  open/close animation for FAQ content, emphasised only if needed.

## Section 2 — Data model (`src/data/support.js`)

```js
export const GUIDE = { en: [...], th: [...] };   // guide topics per locale
export const FAQ = { en: [...], th: [...] };      // faq items per locale
export const GUIDE_CATS = {...};                  // category metadata (id, label)
```

Guide topic:
```js
{
  id: 'create-activity',                     // stable id (future deep-link `#create-activity`)
  icon: 'assets/Class Activity.png',         // reuse existing type asset where applicable
  category: 'content-types',                 // groups topics; also 'getting-started', 'library-export', 'assistant-template'
  title: 'Create a classroom activity',
  summary: 'Turn a prompt into a ready-to-use hands-on activity in 3 steps.',
  steps: [
    { title: 'Open the Generator', text: '...' },
    { title: 'Pick Classroom Activity', text: '...' },
  ],
  screenshots: [ { src: 'support/create-activity-1.png', alt: '...' } ],  // placeholders for now
}
```

FAQ item:
```js
{ id: 'q1', category: 'generating', question: 'Why did my generation fail?', answer: '...' }
```

Category metadata (`GUIDE_CATS`, `FAQ_CATS`) maps category ids to bilingual labels. UI-chrome
category labels go through i18n keys (`support.cat.*`); content lives in `support.js`.

## Section 3 — Page layout & behavior (`SupportPage.jsx`)

- **Header:** title (`support.title`) + subtitle (`support.sub`).
- **Search box** (`<input class="input">`) — live filter across guide titles/summaries/steps and FAQ
  questions/answers. No matches → `support.noResults` + "Clear search" chip.
- **Tab switcher** (`SupportTabs`) — `Teacher's Guide` | `FAQ`; local React state, not persisted.
- **Guide tab:**
  - Topics grouped by category with section labels.
  - Each topic = `.card card-hover` row (icon + title + summary). Clicking expands the article
    in-place below the card; no URL change.
  - `GuideArticle`: numbered steps (`1. 2. 3.`), optional screenshot slot per step (lazy `<img>` with
    `onError` → dashed placeholder).
  - All 6 content types covered, reusing `TYPE_ORDER`/`assetFor` where applicable.
- **FAQ tab:** accordion — question row with `+`/`−` toggle; answer expands below; one item open at a
  time.
- **Footer link** (`AppLayout.jsx`): `<Link to="/support">` labeled `support.link`.

## Section 4 — i18n strings (`i18n.js`)

Add to `en` and `th`:
- `support.link` (footer nav label)
- `support.title`, `support.sub`
- `support.guideTab`, `support.faqTab`
- `support.searchPh`, `support.noResults`, `support.clearSearch`
- Category labels: `support.cat.gettingStarted`, `.contentTypes`, `.libraryExport`, `.assistantTemplate`,
  FAQ cats `.generating`, `.exportTechnical`

Article/FAQ content text itself is NOT duplicated in `i18n.js`; content stays in `support.js`
(matching how `types.js` owns type labels).

## Section 5 — Error handling & edge cases

- No search matches → `support.noResults` + clear-search chip.
- Missing screenshot file → `<img onError>` swaps to dashed placeholder box; layout unaffected.
- Long FAQ answers → render statically, no length constraint.
- Language switch → content re-renders from locale map; open FAQ/guide item resets to closed to avoid
  id mismatch across locales.
- `/support` sits inside `AppLayout` route, so the existing auth gate (`!user → AuthView`) applies.

## Section 6 — Verification

- `npm run build` passes (Vite). No test framework is configured in this repo (no test script in
  `package.json`), so verification is build + manual.
- Manual checklist:
  - Visit `/#/support`; switch EN ↔ ไทย — titles, search, categories translate.
  - Search "activity" → matching guide topics + FAQ; gibberish → empty state with clear chip.
  - Open/close each FAQ; one-at-a-time behavior.
  - Open a guide topic, verify numbered steps + screenshot placeholder.
  - Footer link navigates to `/support`; main nav still shows 4 items only.