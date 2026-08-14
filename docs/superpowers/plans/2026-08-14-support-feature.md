# Support Center (Teacher's Guide + FAQ) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/support` page (router-only, footer link) with bilingual Teacher's Guide and FAQ sections rendered from a data module.

**Architecture:** Content lives in `src/data/support.js` as `en`/`th` locale maps; `SupportPage.jsx` renders it via reusable presentational components (`GuideArticle`, `FaqItem`, `SupportTabs`). UI-chrome strings (page title, tab labels, category labels, search copy) go in the existing i18n DICT; article/FAQ body text stays in the data module, mirroring the `types.js` pattern.

**Tech Stack:** React 18, Vite 5, Tailwind v3, react-router-dom 6 (HashRouter). No test framework is configured — verification is `npm run build` plus a manual checklist.

## Global Constraints

- Two i18n locales must both be kept complete: `en` and `th` (keys in `src/services/i18n.js`).
- Content text (articles, FAQ body) lives in `src/data/support.js`, NOT in `i18n.js`.
- New page uses existing Tailwind/brand utilities (`.card`, `.card-hover`, `.btn`, `.chip`, `.input`, tokens `--primary` etc.). Avoid adding global CSS unless strictly necessary.
- `/support` is added inside the existing `AppLayout` route in `src/App.jsx` — do not touch the auth gate (`!user ? <AuthView/>`).
- Main nav (`NAV_ITEMS` in `AppLayout.jsx`) stays unchanged (still 4 items). Support is footer-link only.
- Screenshot references are placeholders under `public/support/*.png`; a missing `<img>` must fall back to a dashed placeholder box via `onError`.
- No new dependencies. Follow existing import style (`../context/...`, `../data/...`).

---

### Task 1: Add `support.*` i18n strings

**Files:**
- Modify: `src/services/i18n.js` — `en` DICT and `th` DICT

**Interfaces:**
- Consumes: nothing (self-contained).
- Produces: i18n keys used by `SupportPage.jsx` / `SupportTabs.jsx` / `AppLayout.jsx`:
  `support.link`, `support.title`, `support.sub`, `support.guideTab`, `support.faqTab`,
  `support.searchPh`, `support.noResults`, `support.clearSearch`,
  `support.cat.gettingStarted`, `support.cat.contentTypes`, `support.cat.libraryExport`,
  `support.cat.assistantTemplate`, `support.cat.faqGenerating`, `support.cat.faqTechnical`.

- [ ] **Step 1: Add EN keys**

In the `en` DICT (after `'app.logout'`):
```js
'support.link': 'Support',
'support.title': 'Help Center',
'support.sub': 'Teacher\'s Guide and frequently asked questions — get the most out of KruMate.',
'support.guideTab': 'Teacher\'s Guide',
'support.faqTab': 'FAQ',
'support.searchPh': 'Search help…',
'support.noResults': 'No results found. Try different keywords.',
'support.clearSearch': 'Clear search',
'support.cat.gettingStarted': 'Getting started',
'support.cat.contentTypes': 'Content types',
'support.cat.libraryExport': 'Library & export',
'support.cat.assistantTemplate': 'Assistant & template mode',
'support.cat.faqGenerating': 'Generating content',
'support.cat.faqTechnical': 'Export & technical',
```

- [ ] **Step 2: Add TH keys**

In the `th` DICT (after `'app.logout'`):
```js
'support.link': 'ช่วยเหลือ',
'support.title': 'ศูนย์ช่วยเหลือ',
'support.sub': 'คู่มือครูและคำถามที่พบบ่อย — ใช้ KruMate ให้เต็มศักยภาพ',
'support.guideTab': 'คู่มือครู',
'support.faqTab': 'คำถามที่พบบ่อย',
'support.searchPh': 'ค้นหาคำแนะนำ…',
'support.noResults': 'ไม่พบผลลัพธ์ ลองค้นหาด้วยคำอื่น',
'support.clearSearch': 'ล้างการค้นหา',
'support.cat.gettingStarted': 'เริ่มต้นใช้งาน',
'support.cat.contentTypes': 'ประเภทผลงาน',
'support.cat.libraryExport': 'คลังเนื้อหาและการส่งออก',
'support.cat.assistantTemplate': 'ผู้ช่วย AI และโหมดเทมเพลต',
'support.cat.faqGenerating': 'การสร้างเนื้อหา',
'support.cat.faqTechnical': 'การส่งออกและเทคนิค',
```

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: builds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/services/i18n.js
git commit -m "feat: add support page i18n strings"
```

---

### Task 2: Create `src/data/support.js` content module

**Files:**
- Create: `src/data/support.js`

**Interfaces:**
- Consumes: `TYPE_ORDER`, `assetFor`, `labelFor` from `src/data/types.js` for content-type topics.
- Produces (used by `SupportPage.jsx` and `GuideArticle.jsx`):
  - `GUIDE_CATS` — array of `{ id, icon, key }` (key = i18n key from Task 1).
  - `FAQ_CATS` — array of `{ id, icon, key }`.
  - `GUIDE` — `{ en: topic[], th: topic[] }`.
  - `FAQ` — `{ en: entry[], th: entry[] }`.
  - `getGuide(lang)`, `getFaq(lang)`, `getGuideById(lang, id)`.

Topic shape: `{ id, category, icon, title, summary, steps: [{title, text, screenshot?}], screenshots: [{src, alt}] }`
FAQ entry shape: `{ id, category, question, answer }`

- [ ] **Step 1: Write the module**

```js
import { assetFor } from './types.js';

export const GUIDE_CATS = [
  { id: 'getting-started',  icon: 'assets/Create.png',          key: 'support.cat.gettingStarted' },
  { id: 'content-types',    icon: 'assets/Class Activity.png',  key: 'support.cat.contentTypes' },
  { id: 'library-export',   icon: 'assets/Save.png',            key: 'support.cat.libraryExport' },
  { id: 'assistant-template', icon: 'assets/Support.png',       key: 'support.cat.assistantTemplate' },
];

export const FAQ_CATS = [
  { id: 'generating',    icon: 'assets/AI.png',        key: 'support.cat.faqGenerating' },
  { id: 'technical',     icon: 'assets/Settings.png',  key: 'support.cat.faqTechnical' },
];

const icons = {
  lesson: 'assets/plan_for_teacher.png',
  worksheet: 'assets/Worksheet.png',
  quiz: 'assets/Quiz.png',
  slides: 'assets/Presentation Slides.png',
  rubric: 'assets/Assessment.png',
  activity: 'assets/Class Activity.png',
};
const typeIcon = t => icons[t] || assetFor(t);

const GUIDE = { en: [], th: [] };
const FAQ = { en: [], th: [] };

// ---------- Teacher's Guide — content ----------
GUIDE.en.push({
  id: 'create-activity',
  category: 'content-types',
  icon: typeIcon('activity'),
  title: 'Create a classroom activity',
  summary: 'Turn a prompt into a ready-to-use hands-on activity in 3 steps.',
  steps: [
    { title: 'Open the generator', text: 'Click "Generator" in the top nav, or use Quick Create on the dashboard.', screenshot: { src: 'support/create-activity-1.png', alt: 'Generator page' } },
    { title: 'Select the classroom-activity type', text: 'Pick "Classroom Activity" from the output-type tabs, then set your study level and subject.' },
    { title: 'Write a prompt and generate', text: 'Type what you want your students to do and click "Generate". The activity appears on the preview page, ready to save or print.' },
  ],
});
GUIDE.th.push({
  id: 'create-activity',
  category: 'content-types',
  icon: typeIcon('activity'),
  title: 'สร้างกิจกรรมในชั้นเรียน',
  summary: 'เปลี่ยนคำสั่งของคุณเป็นกิจกรรมที่พร้อมใช้ได้ใน 3 ขั้นตอน',
  steps: [
    { title: 'เปิดเครื่องมือสร้าง', text: 'คลิก "เครื่องมือสร้าง" ที่แถบด้านบน หรือใช้ "สร้างด่วน" บนหน้าหลัก', screenshot: { src: 'support/create-activity-1.png', alt: 'หน้าเครื่องมือสร้าง' } },
    { title: 'เลือกประเภท "กิจกรรมในชั้นเรียน"', text: 'เลือก "กิจกรรมในชั้นเรียน" จากแถบประเภทผลงาน แล้วตั้งค่าระดับชั้นและวิชา' },
    { title: 'เขียนคำสั่งและสร้าง', text: 'พิมพ์สิ่งที่ต้องการให้นักเรียนทำ แล้วคลิก "สร้างเลย" กิจกรรมจะปรากฏบนหน้าพรีวิว พร้อมบันทึกหรือพิมพ์' },
  ],
});

GUIDE.en.push({
  id: 'create-lesson',
  category: 'content-types',
  icon: typeIcon('lesson'),
  title: 'Create a lesson plan',
  summary: 'Generate a structured lesson plan with objectives, materials and procedure.',
  steps: [
    { title: 'Start from the generator', text: 'Go to Generator and choose "Lesson Plan" as the output type.' },
    { title: 'Use the template or free prompt', text: 'Template mode fills topic, level, subject and objectives for you; free mode accepts any prompt.' },
    { title: 'Generate and preview', text: 'Click "Generate", review the plan on the preview page, then save it to your library.' },
  ],
});
GUIDE.th.push({
  id: 'create-lesson',
  category: 'content-types',
  icon: typeIcon('lesson'),
  title: 'สร้างแผนการสอน',
  summary: 'สร้างแผนการสอนแบบมีโครงสร้าง พร้อมจุดประสงค์ สื่อ และขั้นตอน',
  steps: [
    { title: 'เริ่มจากเครื่องมือสร้าง', text: 'ไปที่เครื่องมือสร้าง แล้วเลือก "แผนการสอน" เป็นประเภทผลงาน' },
    { title: 'ใช้เทมเพลตหรือพิมพ์เอง', text: 'โหมดเทมเพลตกรอกหัวข้อ ระดับชั้น วิชา และจุดประสงค์ให้อัตโนมัติ ส่วนโหมดอิสระรับคำสั่งใดก็ได้' },
    { title: 'สร้างและดูตัวอย่าง', text: 'คลิก "สร้างเลย" ตรวจสอบแผนบนหน้าพรีวิว แล้วบันทึกลงคลังของคุณ' },
  ],
});

GUIDE.en.push({
  id: 'create-worksheet',
  category: 'content-types',
  icon: typeIcon('worksheet'),
  title: 'Create a worksheet',
  summary: 'Make printable practice exercises for your students.',
  steps: [
    { title: 'Choose the worksheet type', text: 'In the generator, select "Worksheet".' },
    { title: 'Describe the exercise', text: 'Tell the AI the skill or content the worksheet should practise.' },
    { title: 'Generate and export', text: 'Generate, then use Download or "Save as Image" to share it with students.' },
  ],
});
GUIDE.th.push({
  id: 'create-worksheet',
  category: 'content-types',
  icon: typeIcon('worksheet'),
  title: 'สร้างใบงาน',
  summary: 'สร้างแบบฝึกหัดแบบพิมพ์ได้สำหรับนักเรียน',
  steps: [
    { title: 'เลือกประเภทใบงาน', text: 'ในเครื่องมือสร้าง เลือก "ใบงาน"' },
    { title: 'อธิบายแบบฝึกหัด', text: 'บอก AI ถึงทักษะหรือเนื้อหาที่ใบงานควรให้ฝึก' },
    { title: 'สร้างและส่งออก', text: 'สร้างแล้วใช้ "ดาวน์โหลด" หรือ "บันทึกเป็นรูปภาพ" เพื่อส่งให้นักเรียน' },
  ],
});

GUIDE.en.push({
  id: 'create-quiz',
  category: 'content-types',
  icon: typeIcon('quiz'),
  title: 'Create a quiz',
  summary: 'Build a quiz with multiple choice, true/false and short-answer questions.',
  steps: [
    { title: 'Select quiz', text: 'Choose "Quiz" as the output type.' },
    { title: 'Set quiz options', text: 'Pick the number of questions (5–30) and the question types: multiple choice, true/false, short answer.' },
    { title: 'Generate and review', text: 'Generate, review the questions, and fix anything with a follow-up prompt.' },
  ],
});
GUIDE.th.push({
  id: 'create-quiz',
  category: 'content-types',
  icon: typeIcon('quiz'),
  title: 'สร้างแบบทดสอบ',
  summary: 'สร้างข้อสอบปรนัย ถูก/ผิด และข้อเขียนสั้น',
  steps: [
    { title: 'เลือกแบบทดสอบ', text: 'เลือก "แบบทดสอบ" เป็นประเภทผลงาน' },
    { title: 'ตั้งค่าข้อสอบ', text: 'เลือกจำนวนข้อ (5–30) และประเภทคำถาม: ปรนัย ถูก/ผิด ข้อเขียนสั้น' },
    { title: 'สร้างและตรวจทาน', text: 'สร้าง แล้วตรวจสอบคำถามและแก้ไขด้วยคำสั่งเพิ่มเติมได้' },
  ],
});

GUIDE.en.push({
  id: 'create-slides',
  category: 'content-types',
  icon: typeIcon('slides'),
  title: 'Create presentation slides',
  summary: 'Get a presentation outline and slide content in seconds.',
  steps: [
    { title: 'Choose slides', text: 'Select "Slides" in the generator.' },
    { title: 'Write the topic', text: 'Describe the topic and audience, e.g. "Grade 6 science about ecosystems".' },
    { title: 'Generate and export', text: 'Generate the deck outline, then print or export it as an image.' },
  ],
});
GUIDE.th.push({
  id: 'create-slides',
  category: 'content-types',
  icon: typeIcon('slides'),
  title: 'สร้างสไลด์นำเสนอ',
  summary: 'ได้โครงร่างการนำเสนอและเนื้อหาสไลด์ภายในไม่กี่วินาที',
  steps: [
    { title: 'เลือกสไลด์', text: 'เลือก "สไลด์" ในเครื่องมือสร้าง' },
    { title: 'เขียนหัวข้อ', text: 'อธิบายหัวข้อและกลุ่มเป้าหมาย เช่น "วิทยาศาสตร์ ป.6 เรื่องระบบนิเวศ"' },
    { title: 'สร้างและส่งออก', text: 'สร้างโครงร่างการนำเสนอ แล้วพิมพ์หรือส่งออกเป็นรูปภาพ' },
  ],
});

GUIDE.en.push({
  id: 'create-rubric',
  category: 'content-types',
  icon: typeIcon('rubric'),
  title: 'Create a rubric',
  summary: 'Build an assessment rubric with criteria and scoring levels.',
  steps: [
    { title: 'Choose rubric', text: 'Select "Rubric" as the output type.' },
    { title: 'Describe the assessment', text: 'Tell the AI what you are assessing and the scoring scale you want.' },
    { title: 'Generate and adjust', text: 'Generate the rubric and edit criteria so it fits your class.' },
  ],
});
GUIDE.th.push({
  id: 'create-rubric',
  category: 'content-types',
  icon: typeIcon('rubric'),
  title: 'สร้างเกณฑ์การประเมิน',
  summary: 'สร้างเกณฑ์การประเมินพร้อมตัวชี้วัดและระดับคะแนน',
  steps: [
    { title: 'เลือกเกณฑ์การประเมิน', text: 'เลือก "เกณฑ์การประเมิน" เป็นประเภทผลงาน' },
    { title: 'อธิบายการประเมิน', text: 'บอก AI ว่าต้องการประเมินอะไรและใช้ระดับคะแนนแบบใด' },
    { title: 'สร้างและปรับแก้', text: 'สร้างเกณฑ์แล้วแก้ไขตัวชี้วัดให้เหมาะกับชั้นเรียน' },
  ],
});

GUIDE.en.push({
  id: 'library-search',
  category: 'library-export',
  icon: 'assets/Search.png',
  title: 'Search your library',
  summary: 'Find anything you created or saved, fast.',
  steps: [
    { title: 'Open the library', text: 'Go to Library from the top nav, or search directly from the dashboard.' },
    { title: 'Filter and search', text: 'Use the search box and the category / subject filters to narrow results.' },
    { title: 'Open a material', text: 'Click any material to open it in the preview page.' },
  ],
});
GUIDE.th.push({
  id: 'library-search',
  category: 'library-export',
  icon: 'assets/Search.png',
  title: 'ค้นหาสื่อในคลังของคุณ',
  summary: 'ค้นหาทุกสิ่งที่คุณสร้างหรือบันทึกไว้ได้อย่างรวดเร็ว',
  steps: [
    { title: 'เปิดคลังเนื้อหา', text: 'ไปที่ "คลังเนื้อหา" จากแถบด้านบน หรือค้นหาจากหน้าหลักได้เลย' },
    { title: 'กรองและค้นหา', text: 'ใช้ช่องค้นหาและตัวกรองหมวดหมู่/วิชาเพื่อจำกัดผลลัพธ์' },
    { title: 'เปิดสื่อ', text: 'คลิกสื่อใดก็ได้เพื่อเปิดบนหน้าพรีวิว' },
  ],
});

GUIDE.en.push({
  id: 'export-material',
  category: 'library-export',
  icon: 'assets/Export.png',
  title: 'Copy, print, download or save as an image',
  summary: 'Share your materials however your class needs them.',
  steps: [
    { title: 'Open the material', text: 'Open the material you want to share from the preview page or library.' },
    { title: 'Pick the export action', text: 'Choose Copy, Print, Download, or "Save as Image" from the action bar above the content.' },
    { title: 'Share with your class', text: 'Send the file, print copies, or show the image in your classroom.' },
  ],
});
GUIDE.th.push({
  id: 'export-material',
  category: 'library-export',
  icon: 'assets/Export.png',
  title: 'คัดลอก พิมพ์ ดาวน์โหลด หรือบันทึกเป็นรูปภาพ',
  summary: 'แบ่งปันสื่อตามรูปแบบที่ชั้นเรียนของคุณต้องการ',
  steps: [
    { title: 'เปิดสื่อ', text: 'เปิดสื่อที่ต้องการแบ่งปันจากหน้าพรีวิวหรือคลังเนื้อหา' },
    { title: 'เลือกการส่งออก', text: 'เลือก คัดลอก พิมพ์ ดาวน์โหลด หรือ "บันทึกเป็นรูปภาพ" จากแถบเครื่องมือเหนือเนื้อหา' },
    { title: 'แชร์กับชั้นเรียน', text: 'ส่งไฟล์ พิมพ์เอกสาร หรือเปิดภาพในห้องเรียนของคุณ' },
  ],
});

GUIDE.en.push({
  id: 'assistant-chat',
  category: 'assistant-template',
  icon: 'assets/Assist.png',
  title: 'Use the AI Assistant',
  summary: 'Get lesson ideas, worksheet prompts and quiz questions in a chat.',
  steps: [
    { title: 'Open the assistant', text: 'Go to "AI Assistant" in the top nav.' },
    { title: 'Type your question', text: 'Ask for ideas, sample prompts, or how to structure a class.' },
    { title: 'Use the answers', text: 'Copy a suggestion into the generator to turn it into a finished material.' },
  ],
});
GUIDE.th.push({
  id: 'assistant-chat',
  category: 'assistant-template',
  icon: 'assets/Assist.png',
  title: 'ใช้ผู้ช่วย AI',
  summary: 'ขอไอเดียบทเรียน ตัวอย่างใบงาน และคำถามข้อสอบในแชท',
  steps: [
    { title: 'เปิดผู้ช่วย', text: 'ไปที่ "ผู้ช่วย AI" ในแถบด้านบน' },
    { title: 'พิมพ์คำถามของคุณ', text: 'ขอบไอเดีย ตัวอย่างคำสั่ง หรือวิธีจัดโครงสร้างชั้นเรียน' },
    { title: 'ใช้คำตอบ', text: 'คัดลอกคำแนะนำไปยังเครื่องมือสร้างเพื่อแปลงเป็นสื่อสำเร็จรูป' },
  ],
});

GUIDE.en.push({
  id: 'template-mode',
  category: 'assistant-template',
  icon: 'assets/Template.png',
  title: 'Generate from a template',
  summary: 'Fill in a form instead of writing a free-form prompt.',
  steps: [
    { title: 'Switch to template mode', text: 'On the generator, click "Use template".' },
    { title: 'Fill in the form', text: 'Enter topic, duration, learning objectives and notes — the prompt builds itself.' },
    { title: 'Edit and generate', text: 'Adjust the generated prompt if you like, then click "Generate".' },
  ],
});
GUIDE.th.push({
  id: 'template-mode',
  category: 'assistant-template',
  icon: 'assets/Template.png',
  title: 'สร้างจากเทมเพลต',
  summary: 'กรอกฟอร์มแทนการพิมพ์คำสั่งอิสระ',
  steps: [
    { title: 'สลับไปโหมดเทมเพลต', text: 'บนเครื่องมือสร้าง คลิก "ใช้เทมเพลต"' },
    { title: 'กรอกข้อมูล', text: 'กรอกหัวข้อ ระยะเวลา จุดประสงค์ และหมายเหตุ — คำสั่งถูกสร้างให้อัตโนมัติ' },
    { title: 'ปรับแก้และสร้าง', text: 'แก้ไขคำสั่งเพิ่มเติมได้ แล้วคลิก "สร้างเลย"' },
  ],
});

// ---------- FAQ — content ----------
const faq = (id, category, enQ, enA, thQ, thA) => {
  FAQ.en.push({ id, category, question: enQ, answer: enA });
  FAQ.th.push({ id, category, question: thQ, answer: thA });
};

faq('gen-fail',
  'generating',
  'Why did my generation fail?',
  'Generation can fail when the prompt is empty, the AI service is unavailable, or the request times out. Make sure you wrote a prompt, then click Generate again. A mock result appears automatically when the AI service is not available, so demos never break.',
  'ทำไมการสร้างของฉันล้มเหลว',
  'การสร้างอาจล้มเหลวเมื่อคำสั่งว่างเปล่า บริการ AI ใช้งานไม่ได้ หรือหมดเวลา กรุณาเขียนคำสั่งแล้วคลิกสร้างอีกครั้ง ผลลัพธ์ตัวอย่างจะแสดงอัตโนมัติเมื่อบริการ AI ไม่พร้อมใช้งาน เพื่อให้การเดโมไม่สะดุด');

faq('quiz-limits',
  'generating',
  'What quiz settings are available?',
  'You can choose the number of questions (5 to 30) and the question types: multiple choice, true/false, and short answer. You must select at least one question type.',
  'มีการตั้งค่าแบบทดสอบอะไรบ้าง',
  'คุณเลือกจำนวนข้อได้ (5–30 ข้อ) และประเภทคำถาม: ปรนัย ถูก/ผิด และข้อเขียนสั้น ต้องเลือกอย่างน้อยหนึ่งประเภท');

faq('prompt-empty',
  'generating',
  'Why won\'t it generate an empty prompt?',
  'A prompt is required so the AI knows what to create. Try describing the topic, grade level and subject, like "Grade 6 science lesson about ecosystems".',
  'ทำไมพิมพ์คำสั่งว่างแล้วสร้างไม่ได้',
  'ต้องมีคำสั่งเพื่อให้ AI รู้ว่าต้องการสร้างอะไร ลองอธิบายหัวข้อ ระดับชั้น และวิชา เช่น "บทเรียนวิทยาศาสตร์ ป.6 เรื่องระบบนิเวศ"');

faq('api-key',
  'technical',
  'Do I need a Gemini API key to use KruMate?',
  'No. The app works with mock data by default. To use real AI generation, the serverless proxy needs a GEMINI_API_KEY environment variable set on the server — the key is never exposed to the browser.',
  'ต้องใช้ Gemini API Key เพื่อใช้ KruMate ใช่ไหม',
  'ไม่จำเป็น แอปทำงานด้วยข้อมูลตัวอย่างโดยค่าเริ่มต้น หากต้องการใช้ AI จริง ต้องตั้งตัวแปร GEMINI_API_KEY บนเซิร์ฟเวอร์ผ่าน serverless proxy — คีย์ไม่ถูกส่งออกไปยังเบราว์เซอร์');

faq('data-storage',
  'technical',
  'Where are my materials stored?',
  'Everything is stored in your browser (local storage). Materials you have saved appear in the Library; unsaved content lives in a temporary store for the current session.',
  'สื่อของฉันถูกเก็บไว้ที่ไหน',
  'ข้อมูลทั้งหมดถูกเก็บในเบราว์เซอร์ของคุณ (local storage) สื่อที่บันทึกแล้วจะอยู่ในคลัง ส่วนเนื้อหาที่ยังไม่บันทึกจะอยู่ในหน่วยความจำชั่วคราวของเซสชันนี้');

faq('export-image',
  'technical',
  'How do I save a material as an image?',
  'Open the material, then click "Save as Image" in the action bar. The content is rendered into a PNG you can download and share.',
  'จะบันทึกสื่อเป็นรูปภาพได้อย่างไร',
  'เปิดสื่อ แล้วคลิก "บันทึกเป็นรูปภาพ" ในแถบเครื่องมือ เนื้อหาจะถูกแปลงเป็นไฟล์ PNG ให้ดาวน์โหลดและแชร์ได้');

// ---------- Helpers ----------
export function getGuide(lang) { return GUIDE[lang] || GUIDE.en; }
export function getFaq(lang) { return FAQ[lang] || FAQ.en; }
export function getGuideById(lang, id) {
  return (getGuide(lang) || []).find(g => g.id === id);
}
export default { GUIDE_CATS, FAQ_CATS, GUIDE, FAQ, getGuide, getFaq, getGuideById };
```

Note: the icon filenames above (`assets/Create.png`, `assets/Save.png`, `assets/Support.png`, `assets/AI.png`, `assets/Settings.png`, `assets/Search.png`, `assets/Export.png`, `assets/Assist.png`, `assets/Template.png`) do not exist yet. They are safe as `src` values (missing images produce the placeholder fallback), but if you prefer zero broken references, point all category/utility icons at existing assets from `src/assets/` (e.g. `assets/Class Activity.png`).

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: builds with no errors (module exports compile).

- [ ] **Step 3: Commit**

```bash
git add src/data/support.js
git commit -m "feat: add bilingual support content module"
```

---

### Task 3: Create support components

**Files:**
- Create: `src/components/support/GuideArticle.jsx`
- Create: `src/components/support/FaqItem.jsx`
- Create: `src/components/support/SupportTabs.jsx`

**Interfaces:**
- Consumes: topic objects / FAQ entries from Task 2; `support.*` i18n keys from Task 1.
- Produces (used by `SupportPage.jsx`):
  - `GuideArticle({ topic, onClose })` — affords a "collapse" control (calls `onClose`).
  - `FaqItem({ entry, open, onToggle })`.
  - `SupportTabs({ tabs, active, onChange })` where `tabs = [{id, label}]`.

- [ ] **Step 1: Write `GuideArticle.jsx`**

```jsx
export default function GuideArticle({ topic, onClose }) {
  return (
    <div className="card mt-3 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          {topic.icon && <img src={topic.icon} alt="" className="w-12 h-12 object-contain shrink-0" />}
          <h3 className="text-lg font-semibold">{topic.title}</h3>
        </div>
        <button type="button" className="btn btn-ghost px-2.5 text-sm" onClick={onClose}>✕</button>
      </div>
      <p className="text-muted text-sm mb-4">{topic.summary}</p>
      <ol className="space-y-5">
        {topic.steps.map((step, i) => (
          <li key={i} className="flex gap-4">
            <span className="w-8 h-8 shrink-0 rounded-full bg-primary text-dark font-semibold flex items-center justify-center">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <h4 className="font-medium mb-1">{step.title}</h4>
              <p className="text-sm text-muted">{step.text}</p>
              {step.screenshot && (
                <img
                  src={step.screenshot.src}
                  alt={step.screenshot.alt}
                  loading="lazy"
                  className="mt-3 rounded-xl border border-line bg-soft w-full max-w-md h-40 object-cover placeholder"
                  onError={e => { e.currentTarget.classList.add('img-placeholder'); e.currentTarget.onerror = null; }}
                />
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
```

A small `.img-placeholder` class will be added in Task 4's step that creates `SupportPage.jsx` (or you may add it to `src/index.css` in that task):
```css
.img-placeholder {
  background-image: repeating-linear-gradient(45deg, #FBF3E8 0 10px, #F2E9DE 10px 20px);
  border: 1px dashed #B9A58F;
}
```

- [ ] **Step 2: Write `FaqItem.jsx`**

```jsx
export default function FaqItem({ entry, open, onToggle }) {
  const id = 'faq-' + entry.id;
  return (
    <div className="card mb-3 overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 text-left"
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
      >
        <span className="font-medium pr-4">{entry.question}</span>
        <span className="shrink-0 text-primary text-xl leading-none" aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div id={id} className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-muted leading-relaxed">
          {entry.answer}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Write `SupportTabs.jsx`**

```jsx
export default function SupportTabs({ tabs, active, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-6" role="tablist" aria-label="Support sections">
      {tabs.map(tab => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          className={'chip' + (active === tab.id ? ' chip-active' : '')}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: builds with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/support/
git commit -m "feat: add support presentational components"
```

---

### Task 4: Create `SupportPage.jsx`

**Files:**
- Create: `src/pages/SupportPage.jsx`
- Create: `src/public/support/.gitkeep` (or just ensure the folder exists when screenshots are added later — optional)
- Modify: `src/index.css` (append `.img-placeholder` rule)

**Interfaces:**
- Consumes: `getGuide`, `getFaq`, `GUIDE_CATS`, `FAQ_CATS` from Task 2; `useI18n`; components from Task 3.
- Produces: default-exported `SupportPage` component rendered at route `/support`.

- [ ] **Step 1: Write the page**

```jsx
import { useMemo, useState } from 'react';
import { useI18n } from '../context/I18nContext.jsx';
import { GUIDE_CATS, FAQ_CATS, getGuide, getFaq } from '../data/support.js';
import SupportTabs from '../components/support/SupportTabs.jsx';
import GuideArticle from '../components/support/GuideArticle.jsx';
import FaqItem from '../components/support/FaqItem.jsx';

const TABS = [
  { id: 'guide', labelKey: 'support.guideTab' },
  { id: 'faq', labelKey: 'support.faqTab' },
];

export default function SupportPage() {
  const { t, lang } = useI18n();
  const [tab, setTab] = useState('guide');
  const [query, setQuery] = useState('');
  const [openTopic, setOpenTopic] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const guide = useMemo(() => getGuide(lang), [lang]);
  const faq = useMemo(() => getFaq(lang), [lang]);
  const q = query.trim().toLowerCase();

  const match = s => !q || s.toLowerCase().includes(q);

  const filteredGuide = useMemo(() => {
    if (!q) return guide;
    return guide.filter(topic =>
      match(topic.title) || match(topic.summary) ||
      (topic.steps || []).some(s => match(s.title) || match(s.text))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guide, q]);

  const filteredFaq = useMemo(() => {
    if (!q) return faq;
    return faq.filter(entry =>
      match(entry.question) || match(entry.answer)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faq, q]);

  const catById = (cats, id) => cats.find(c => c.id === id);

  const hasResults = (tab === 'guide' ? filteredGuide : filteredFaq).length > 0;

  const clearSearch = () => setQuery('');

  const groups = catByIdList => catByIdList.map(cat => ({
    cat,
    topics: filteredGuide.filter(t => t.category === cat.id),
  })).filter(g => g.topics.length);

  return (
    <section id="page-support" className="page">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold">{t('support.title')}</h1>
        <p className="text-muted text-sm mt-1">{t('support.sub')}</p>
      </div>

      <div className="relative max-w-xl mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">⌕</span>
        <input
          type="search"
          className="input pl-11"
          placeholder={t('support.searchPh')}
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <SupportTabs
        tabs={TABS.map(x => ({ id: x.id, label: t(x.labelKey) }))}
        active={tab}
        onChange={setTab}
      />

      {!hasResults ? (
        <div className="card p-8 text-center">
          <p className="text-muted mb-3">{t('support.noResults')}</p>
          <button className="btn btn-secondary" onClick={clearSearch}>{t('support.clearSearch')}</button>
        </div>
      ) : tab === 'guide' ? (
        <div className="space-y-8">
          {groupByCat(filteredGuide).map(({ cat, topics }) => (
            <div key={cat.id}>
              <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                {cat.icon && <img src={cat.icon} alt="" className="w-5 h-5 object-contain" />}
                {t(cat.key)}
              </h2>
              <div className="space-y-3">
                {topics.map(topic => (
                  <div key={topic.id}>
                    <button
                      type="button"
                      className="card card-hover w-full text-left p-4 flex items-center gap-3"
                      onClick={() => setOpenTopic(openTopic === topic.id ? null : topic.id)}
                      aria-expanded={openTopic === topic.id}
                    >
                      {topic.icon && <img src={topic.icon} alt="" className="w-11 h-11 rounded-lg object-contain bg-soft/40 border border-line shrink-0" />}
                      <span className="flex-1 min-w-0">
                        <span className="block font-medium">{topic.title}</span>
                        <span className="block text-sm text-muted">{topic.summary}</span>
                      </span>
                      <span className="text-muted">{openTopic === topic.id ? '−' : '→'}</span>
                    </button>
                    {openTopic === topic.id && (
                      <GuideArticle topic={topic} onClose={() => setOpenTopic(null)} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {FAQ_CATS.map(cat => {
            const items = filteredFaq.filter(f => f.category === cat.id);
            if (!items.length) return null;
            return (
              <div key={cat.id} className="mb-6">
                <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                  {cat.icon && <img src={cat.icon} alt="" className="w-5 h-5 object-contain" />}
                  {t(cat.key)}
                </h2>
                {items.map(entry => (
                  <FaqItem
                    key={entry.id}
                    entry={entry}
                    open={openFaq === entry.id}
                    onToggle={() => setOpenFaq(openFaq === entry.id ? null : entry.id)}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function groupByCat(topics) {
  const map = new Map();
  topics.forEach(t => {
    if (!map.has(t.category)) map.set(t.category, []);
    map.get(t.category).push(t);
  });
  return GUIDE_CATS
    .filter(cat => map.has(cat.id))
    .map(cat => ({ cat, topics: map.get(cat.id) }));
}
```

Remove the stale `groups` and `catById` helpers from the top of the component (they are leftovers from an earlier sketch) — the page relies on `groupByCat` defined at the bottom. Keep the component lean.

- [ ] **Step 2: Append `.img-placeholder` to `src/index.css`**

Append at the end of `src/index.css`:
```css
/* ---------- Support ---------- */
.img-placeholder {
  background-image: repeating-linear-gradient(45deg, #FBF3E8 0 10px, #F2E9DE 10px 20px);
  border: 1px dashed #B9A58F;
}
```

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: builds with no errors. (The `.img-placeholder` class is only applied on `onError`, so a missing image never shows a broken icon.)

- [ ] **Step 4: Commit**

```bash
git add src/pages/SupportPage.jsx src/index.css
git commit -m "feat: add support page with search, guide and faq"
```

---

### Task 5: Wire route and footer link

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/layouts/AppLayout.jsx`

**Interfaces:**
- Consumes: default export of `SupportPage` from Task 4; `support.link` key from Task 1.
- Produces: working `/support` route and footer navigation link.

- [ ] **Step 1: Add route to `App.jsx`**

Import `SupportPage` alongside the other pages:
```jsx
import SupportPage from './pages/SupportPage.jsx';
```
Add the route inside the `AppLayout` route block (after the `/assistant` route):
```jsx
<Route path="/support" element={<SupportPage />} />
```

- [ ] **Step 2: Add footer link to `AppLayout.jsx`**

In `AppLayout.jsx`, import `Link` is already present. In the footer, extend the middle paragraph so it links to `/support`. Replace the current:
```jsx
<p>{t('footer.tag')}</p>
```
with:
```jsx
<p>
  {t('footer.tag')} ·{' '}
  <Link to="/support" className="underline hover:text-primary">{t('support.link')}</Link>
</p>
```

Do NOT modify `NAV_ITEMS` — the main nav must remain exactly the 4 items.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: builds with no errors.

- [ ] **Step 4: Manual verification checklist**

Run `npm run dev` and check in the browser:
- [ ] Visit `/#/support` while logged in → Help Center page renders.
- [ ] Switch EN ↔ ไทย → title, subtitle, tabs, category labels and content translate.
- [ ] Search "activity" → guide topics + FAQ match; type gibberish → empty state with "Clear search" (or "%s" replacement) chip.
- [ ] FAQ: open/close items; only one open at a time.
- [ ] Guide: click a topic → numbered steps + screenshot placeholder box (image missing → dashed fallback).
- [ ] Footer "Support" link → navigates to `/support`; back to dashboard → main nav still shows 4 items.

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx src/layouts/AppLayout.jsx
git commit -m "feat: wire support route and footer link"
```

---

## Self-Review Notes

- Spec coverage: Teacher's Guide (all 6 types + activity + assistant/template + library/export topics) ✓ Task 2; FAQ (generating + technical) ✓ Task 2; search + tabs + accordion + inline expansion ✓ Task 4; footer-only discovery ✓ Task 5; bilingual ✓ Tasks 1–2; screenshot placeholders ✓ Tasks 2 & 4; auth gate preserved ✓ Task 5.
- Type consistency: `getGuide`/`getFaq`/`getGuideById` signatures fixed across Tasks 2–4; `Topic`/`FaqEntry` shapes consistent.