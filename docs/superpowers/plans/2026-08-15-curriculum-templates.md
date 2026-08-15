# MOE Curriculum Templates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "MOE Curriculum Templates" (เทมเพลตหลักสูตร สพฐ.) tab to the Library page with 144 static, bilingual (EN/TH) slide templates — one topic per subject × grade (ป.1–ม.6, 12 subjects) — that users can open and save into their own library.

**Architecture:** Templates live as static data modules under `src/data/curriculum/` (mirroring the existing `src/data/types.js` / `src/data/support.js` pattern). `STORE.find(id)` falls back to this module so `/content/:id` renders templates unchanged. `renderSlides` resolves bilingual `{th,en}` fields by current language while staying backward-compatible with single-language user items. The Library page gets a two-tab switcher; the template tab has its own filters and cards; saving a template clones it under a fresh id into the user's library.

**Tech Stack:** React 18.3.1, Vite 5, Tailwind CSS 3, react-router-dom 6 (HashRouter), localStorage-backed store. No test framework — verification is `npm run build` + node verify scripts + manual checklist.

## Global Constraints

- `package.json` has no test script; verification = `npm run build` (Vite) + `node scripts/*.mjs` + manual browser checks.
- Subject values must match `SUBJECTS` exactly in `src/data/types.js` (Science, Mathematics, Thai, English, Social Studies, Other, Physics, Chemistry, Biology, History, Geography, Computing).
- Grade values must match `LEVELS` exactly in `src/data/types.js` (p1–m6). Kindergarten `k` is excluded.
- Bilingual fields are `{ th, en }` objects; user items may keep plain strings — the renderer must handle both.
- Every template is `type: 'slides'` with 5–8 slides.
- Template ids are stable strings of form `moe-<subject>-<grade>-<nn>` (e.g. `moe-math-p1-01`).
- UI chrome strings go in `src/services/i18n.js` under `lib.*` and `content.*`; template *content* lives only in `src/data/curriculum/`.
- Disclaimer copy: "เนื้อหาตัวชี้วัดรวบรวมตามหลักสูตร สพฐ. ควรตรวจทานกับฉบับทางการก่อนนำไปใช้" / EN "Indicators compiled from the MOE curriculum; please verify against the official version before use."

---

### Task 1: Curriculum data infrastructure + reference file (Math.js)

**Files:**
- Create: `src/data/curriculum/index.js`
- Create: `src/data/curriculum/Math.js` (complete reference — all 12 grades)
- Create: `scripts/verify-curriculum.mjs`

**Interfaces:**
- Produces:
  - `export const TEMPLATES: Array<object>` — flat array of all templates from all subject files.
  - `export function findTemplateById(id: string): object | null` — returns the matching template or null.
  - Template shape (used by Tasks 2–6): `{ id, type: 'slides', subject, grade, topic: {th,en}, indicators: string[], outline: [{th,en}], slides: [{ title:{th,en}, subtitle:{th,en}, bullets:[{th,en}] }] }`

- [ ] **Step 1: Write `src/data/curriculum/Math.js`** with 12 entries (p1–m6), each fully bilingual. Complete content below. Slide field values are plain-string-free; every `title`/`subtitle`/`bullets` element is `{th,en}`. Copy this file's structure for all later subject files.

```js
export const MATH = [
  {
    id: 'moe-math-p1-01',
    type: 'slides',
    subject: 'Mathematics',
    grade: 'p1',
    topic: { th: 'การนับและการบวกจำนวนนับไม่เกิน 100', en: 'Counting and Adding Numbers up to 100' },
    indicators: ['ค1.1 ป.1/1', 'ค1.1 ป.1/2', 'ค1.1 ป.1/3'],
    outline: [
      { th: 'สไลด์ชื่อเรื่อง', en: 'Title slide' },
      { th: 'จุดประสงค์การเรียนรู้', en: 'Learning objectives' },
      { th: 'แนวคิดหลัก', en: 'Key ideas' },
      { th: 'ตัวอย่าง', en: 'Examples' },
      { th: 'การฝึกปฏิบัติ', en: 'Guided practice' },
      { th: 'สรุปและใบงาน', en: 'Summary and worksheet' }
    ],
    slides: [
      { title: { th: 'การนับและการบวกจำนวนนับไม่เกิน 100', en: 'Counting and Adding Numbers up to 100' }, subtitle: { th: 'คณิตศาสตร์ ชั้น ป.1', en: 'Mathematics, Grade 1' }, bullets: [] },
      { title: { th: 'จุดประสงค์การเรียนรู้', en: 'Learning Objectives' }, subtitle: { th: 'ตัวชี้วัด ค1.1 ป.1/1–3', en: 'Indicators ค1.1 P1/1–3' }, bullets: [
        { th: 'บอกจำนวนและอ่านตัวเลข 1–100 ได้', en: 'Count and read numbers 1–100' },
        { th: 'เปรียบเทียบและเรียงลำดับจำนวนได้', en: 'Compare and order numbers' },
        { th: 'บวกจำนวนสองหลักกับหลักเดียวโดยไม่ทดได้', en: 'Add a two-digit and a one-digit number without carrying' }
      ] },
      { title: { th: 'แนวคิดหลัก', en: 'Key Ideas' }, subtitle: { th: 'ความเข้าใจพื้นฐาน', en: 'Core understanding' }, bullets: [
        { th: 'จำนวนคือค่าที่บอกปริมาณของสิ่งของ', en: 'A number tells how many objects there are' },
        { th: 'การบวกคือการนับรวมเข้าด้วยกัน', en: 'Addition means counting together' },
        { th: 'ใช้เส้นจำนวนช่วยในการนับและการบวก', en: 'Use a number line to count and add' }
      ] },
      { title: { th: 'ตัวอย่างการบวก', en: 'Addition Example' }, subtitle: { th: 'ฝึกทีละขั้น', en: 'Step by step' }, bullets: [
        { th: '23 + 5 = 28', en: '23 + 5 = 28' },
        { th: 'เริ่มจากหลักหน่วย: 3 + 5 = 8', en: 'Start with ones: 3 + 5 = 8' },
        { th: 'แล้วรวมกับหลักสิบ: 20 + 8 = 28', en: 'Then combine the tens: 20 + 8 = 28' }
      ] },
      { title: { th: 'การฝึกปฏิบัติ', en: 'Guided Practice' }, subtitle: { th: 'ทำด้วยกันในชั้นเรียน', en: 'Practice together in class' }, bullets: [
        { th: 'เติมตัวเลขที่หายไปในเส้นจำนวน', en: 'Fill in missing numbers on a number line' },
        { th: 'จับคู่การ์ดตัวเลขกับจำนวนสิ่งของ', en: 'Match number cards to sets of objects' },
        { th: 'หาผลบวก: 12+3, 34+5, 41+7', en: 'Find the sums: 12+3, 34+5, 41+7' }
      ] },
      { title: { th: 'สรุปและใบงาน', en: 'Summary and Worksheet' }, subtitle: { th: 'ตรวจความเข้าใจ', en: 'Check understanding' }, bullets: [
        { th: 'ทบทวน: นับ บอกค่า และบวกจำนวนไม่เกิน 100', en: 'Review: count, name, and add numbers up to 100' },
        { th: 'ทำใบงาน "การบวกไม่เกิน 100" ให้ครบ', en: 'Complete the worksheet "Adding up to 100"' },
        { th: 'คำถามปิดท้าย: อะไรคือการบวก?', en: 'Exit question: What is addition?' }
      ] }
    ]
  },
  {
    id: 'moe-math-p2-01',
    type: 'slides',
    subject: 'Mathematics',
    grade: 'p2',
    topic: { th: 'การบวกและการลบจำนวนนับไม่เกิน 1,000', en: 'Adding and Subtracting Numbers up to 1,000' },
    indicators: ['ค1.1 ป.2/1', 'ค1.1 ป.2/2', 'ค1.1 ป.2/3'],
    outline: [
      { th: 'สไลด์ชื่อเรื่อง', en: 'Title slide' },
      { th: 'จุดประสงค์การเรียนรู้', en: 'Learning objectives' },
      { th: 'แนวคิดหลัก', en: 'Key ideas' },
      { th: 'ตัวอย่าง', en: 'Examples' },
      { th: 'การฝึกปฏิบัติ', en: 'Guided practice' },
      { th: 'สรุปและใบงาน', en: 'Summary and worksheet' }
    ],
    slides: [
      { title: { th: 'การบวกและการลบจำนวนนับไม่เกิน 1,000', en: 'Adding and Subtracting Numbers up to 1,000' }, subtitle: { th: 'คณิตศาสตร์ ชั้น ป.2', en: 'Mathematics, Grade 2' }, bullets: [] },
      { title: { th: 'จุดประสงค์การเรียนรู้', en: 'Learning Objectives' }, subtitle: { th: 'ตัวชี้วัด ค1.1 ป.2/1–3', en: 'Indicators ค1.1 P2/1–3' }, bullets: [
        { th: 'บวกและลบจำนวนไม่เกิน 1,000 ได้', en: 'Add and subtract numbers up to 1,000' },
        { th: 'หาผลบวกโดยการกระจายหลักได้', en: 'Find sums by place-value decomposition' },
        { th: 'ตรวจสอบความสมเหตุสมผลของคำตอบได้', en: 'Check that answers are reasonable' }
      ] },
      { title: { th: 'แนวคิดหลัก', en: 'Key Ideas' }, subtitle: { th: 'ความเข้าใจพื้นฐาน', en: 'Core understanding' }, bullets: [
        { th: 'การบวกหลายหลักต้องตั้งหลักให้ตรงกัน', en: 'Align digits by place value when adding' },
        { th: 'การลบอาจต้องยืมจากหลักถัดไป', en: 'Subtraction may require borrowing' },
        { th: 'ใช้การประมาณเพื่อตรวจคำตอบ', en: 'Use estimation to check answers' }
      ] },
      { title: { th: 'ตัวอย่าง', en: 'Examples' }, subtitle: { th: 'บวกและลบ', en: 'Add and subtract' }, bullets: [
        { th: '346 + 128 = 474', en: '346 + 128 = 474' },
        { th: '500 – 137 = 363', en: '500 – 137 = 363' },
        { th: 'ตรวจ: 474 – 128 = 346', en: 'Check: 474 – 128 = 346' }
      ] },
      { title: { th: 'การฝึกปฏิบัติ', en: 'Guided Practice' }, subtitle: { th: 'ทำด้วยกันในชั้นเรียน', en: 'Practice together in class' }, bullets: [
        { th: 'บวกและลบด้วยการกระจายหลัก', en: 'Add and subtract using place values' },
        { th: 'แก้โจทย์: 265+318, 700–245', en: 'Solve: 265+318, 700–245' },
        { th: 'ประมาณคำตอบก่อนคำนวณทุกครั้ง', en: 'Estimate before calculating each time' }
      ] },
      { title: { th: 'สรุปและใบงาน', en: 'Summary and Worksheet' }, subtitle: { th: 'ตรวจความเข้าใจ', en: 'Check understanding' }, bullets: [
        { th: 'ทบทวนการบวก ลบ และการตรวจคำตอบ', en: 'Review addition, subtraction, and checking' },
        { th: 'ทำใบงาน "บวก-ลบไม่เกิน 1,000"', en: 'Complete the worksheet "Add-subtract up to 1,000"' },
        { th: 'คำถามปิดท้าย: เราตรวจคำตอบได้อย่างไร?', en: 'Exit question: How do we check our answer?' }
      ] }
    ]
  },
  {
    id: 'moe-math-p3-01',
    type: 'slides',
    subject: 'Mathematics',
    grade: 'p3',
    topic: { th: 'การคูณและการหารจำนวนนับ', en: 'Multiplication and Division of Whole Numbers' },
    indicators: ['ค1.1 ป.3/1', 'ค1.1 ป.3/2'],
    outline: [
      { th: 'สไลด์ชื่อเรื่อง', en: 'Title slide' },
      { th: 'จุดประสงค์การเรียนรู้', en: 'Learning objectives' },
      { th: 'แนวคิดหลัก', en: 'Key ideas' },
      { th: 'ตัวอย่าง', en: 'Examples' },
      { th: 'การฝึกปฏิบัติ', en: 'Guided practice' },
      { th: 'สรุปและใบงาน', en: 'Summary and worksheet' }
    ],
    slides: [
      { title: { th: 'การคูณและการหารจำนวนนับ', en: 'Multiplication and Division of Whole Numbers' }, subtitle: { th: 'คณิตศาสตร์ ชั้น ป.3', en: 'Mathematics, Grade 3' }, bullets: [] },
      { title: { th: 'จุดประสงค์การเรียนรู้', en: 'Learning Objectives' }, subtitle: { th: 'ตัวชี้วัด ค1.1 ป.3/1–2', en: 'Indicators ค1.1 P3/1–2' }, bullets: [
        { th: 'หาผลคูณจำนวนไม่เกิน 3 หลักกับ 1–2 หลักได้', en: 'Multiply numbers up to 3 digits by 1–2 digits' },
        { th: 'หาผลหารและเศษจากการหารได้', en: 'Find quotients and remainders' },
        { th: 'ใช้ความสัมพันธ์ของคูณ-หารช่วยคำนวณได้', en: 'Use the inverse relationship of × and ÷' }
      ] },
      { title: { th: 'แนวคิดหลัก', en: 'Key Ideas' }, subtitle: { th: 'ความเข้าใจพื้นฐาน', en: 'Core understanding' }, bullets: [
        { th: 'การคูณคือการบวกซ้ำกันหลายครั้ง', en: 'Multiplication is repeated addition' },
        { th: 'การหารคือการแบ่งเท่า ๆ กัน', en: 'Division is sharing equally' },
        { th: 'แม่สูตรคูณช่วยให้คำนวณเร็วขึ้น', en: 'Multiplication tables speed up calculation' }
      ] },
      { title: { th: 'ตัวอย่าง', en: 'Examples' }, subtitle: { th: 'คูณและหาร', en: 'Multiply and divide' }, bullets: [
        { th: '23 × 4 = 92', en: '23 × 4 = 92' },
        { th: '84 ÷ 7 = 12 (ไม่มีเศษ)', en: '84 ÷ 7 = 12 (no remainder)' },
        { th: 'ตรวจ: 12 × 7 = 84', en: 'Check: 12 × 7 = 84' }
      ] },
      { title: { th: 'การฝึกปฏิบัติ', en: 'Guided Practice' }, subtitle: { th: 'ทำด้วยกันในชั้นเรียน', en: 'Practice together in class' }, bullets: [
        { th: 'ท่องแม่สูตรคูณ 2–9 พร้อมกัน', en: 'Chant multiplication tables 2–9 together' },
        { th: 'แก้โจทย์: 56×3, 96÷4', en: 'Solve: 56×3, 96÷4' },
        { th: 'เล่นเกม "คูณ-หารเร็ว"', en: 'Play the "Fast multiply-divide" game' }
      ] },
      { title: { th: 'สรุปและใบงาน', en: 'Summary and Worksheet' }, subtitle: { th: 'ตรวจความเข้าใจ', en: 'Check understanding' }, bullets: [
        { th: 'ทบทวนการคูณและการหาร', en: 'Review multiplication and division' },
        { th: 'ทำใบงาน "คูณ-หาร ป.3"', en: 'Complete the "Multiply-divide P3" worksheet' },
        { th: 'คำถามปิดท้าย: คูณกับหารสัมพันธ์กันอย่างไร?', en: 'Exit question: How are × and ÷ related?' }
      ] }
    ]
  },
  {
    id: 'moe-math-p4-01',
    type: 'slides',
    subject: 'Mathematics',
    grade: 'p4',
    topic: { th: 'เศษส่วนและการบวก-ลบเศษส่วน', en: 'Fractions and Adding-Subtracting Fractions' },
    indicators: ['ค1.1 ป.4/1', 'ค1.1 ป.4/2'],
    outline: [
      { th: 'สไลด์ชื่อเรื่อง', en: 'Title slide' },
      { th: 'จุดประสงค์การเรียนรู้', en: 'Learning objectives' },
      { th: 'แนวคิดหลัก', en: 'Key ideas' },
      { th: 'ตัวอย่าง', en: 'Examples' },
      { th: 'การฝึกปฏิบัติ', en: 'Guided practice' },
      { th: 'สรุปและใบงาน', en: 'Summary and worksheet' }
    ],
    slides: [
      { title: { th: 'เศษส่วนและการบวก-ลบเศษส่วน', en: 'Fractions and Adding-Subtracting Fractions' }, subtitle: { th: 'คณิตศาสตร์ ชั้น ป.4', en: 'Mathematics, Grade 4' }, bullets: [] },
      { title: { th: 'จุดประสงค์การเรียนรู้', en: 'Learning Objectives' }, subtitle: { th: 'ตัวชี้วัด ค1.1 ป.4/1–2', en: 'Indicators ค1.1 P4/1–2' }, bullets: [
        { th: 'อ่าน เขียน และเปรียบเทียบเศษส่วนได้', en: 'Read, write, and compare fractions' },
        { th: 'บวกและลบเศษส่วนที่มีตัวส่วนเท่ากันได้', en: 'Add and subtract fractions with like denominators' },
        { th: 'เชื่อมโยงเศษส่วนกับสิ่งของในชีวิตจริงได้', en: 'Connect fractions to real objects' }
      ] },
      { title: { th: 'แนวคิดหลัก', en: 'Key Ideas' }, subtitle: { th: 'ความเข้าใจพื้นฐาน', en: 'Core understanding' }, bullets: [
        { th: 'เศษส่วนคือส่วนหนึ่งของทั้งหมดที่แบ่งเท่า ๆ กัน', en: 'A fraction is one part of equal parts' },
        { th: 'ตัวส่วนบอกจำนวนส่วนที่แบ่งทั้งหมด', en: 'The denominator tells the total equal parts' },
        { th: 'บวก-ลบเศษส่วนต้องมีตัวส่วนเท่ากัน', en: 'Add/subtract fractions with the same denominator' }
      ] },
      { title: { th: 'ตัวอย่าง', en: 'Examples' }, subtitle: { th: 'บวกและลบเศษส่วน', en: 'Add and subtract fractions' }, bullets: [
        { th: '1/4 + 2/4 = 3/4', en: '1/4 + 2/4 = 3/4' },
        { th: '3/5 – 1/5 = 2/5', en: '3/5 – 1/5 = 2/5' },
        { th: 'วาดรูปช่วยให้เห็นภาพชัดขึ้น', en: 'Draw pictures to see it clearly' }
      ] },
      { title: { th: 'การฝึกปฏิบัติ', en: 'Guided Practice' }, subtitle: { th: 'ทำด้วยกันในชั้นเรียน', en: 'Practice together in class' }, bullets: [
        { th: 'แบ่งกระดาษเป็น 4 ส่วน แล้วระบายสี', en: 'Fold paper into 4 parts and shade' },
        { th: 'เติม: 2/6 + 3/6 = ?', en: 'Fill in: 2/6 + 3/6 = ?' },
        { th: 'จับคู่เศษส่วนกับภาพ', en: 'Match fractions to pictures' }
      ] },
      { title: { th: 'สรุปและใบงาน', en: 'Summary and Worksheet' }, subtitle: { th: 'ตรวจความเข้าใจ', en: 'Check understanding' }, bullets: [
        { th: 'ทบทวนความหมายและการบวก-ลบเศษส่วน', en: 'Review fraction meaning and add/subtract' },
        { th: 'ทำใบงาน "เศษส่วน ป.4"', en: 'Complete the "Fractions P4" worksheet' },
        { th: 'คำถามปิดท้าย: ทำไมตัวส่วนต้องเท่ากัน?', en: 'Exit question: Why must denominators match?' }
      ] }
    ]
  },
  {
    id: 'moe-math-p5-01',
    type: 'slides',
    subject: 'Mathematics',
    grade: 'p5',
    topic: { th: 'ทศนิยมและการบวก-ลบ-คูณ-หารทศนิยม', en: 'Decimals and Operations with Decimals' },
    indicators: ['ค1.1 ป.5/1', 'ค1.1 ป.5/2'],
    outline: [
      { th: 'สไลด์ชื่อเรื่อง', en: 'Title slide' },
      { th: 'จุดประสงค์การเรียนรู้', en: 'Learning objectives' },
      { th: 'แนวคิดหลัก', en: 'Key ideas' },
      { th: 'ตัวอย่าง', en: 'Examples' },
      { th: 'การฝึกปฏิบัติ', en: 'Guided practice' },
      { th: 'สรุปและใบงาน', en: 'Summary and worksheet' }
    ],
    slides: [
      { title: { th: 'ทศนิยมและการดำเนินการ', en: 'Decimals and Operations' }, subtitle: { th: 'คณิตศาสตร์ ชั้น ป.5', en: 'Mathematics, Grade 5' }, bullets: [] },
      { title: { th: 'จุดประสงค์การเรียนรู้', en: 'Learning Objectives' }, subtitle: { th: 'ตัวชี้วัด ค1.1 ป.5/1–2', en: 'Indicators ค1.1 P5/1–2' }, bullets: [
        { th: 'อ่าน เขียน และเปรียบเทียบทศนิยมได้', en: 'Read, write, and compare decimals' },
        { th: 'บวก ลบ คูณ หารทศนิยมได้', en: 'Add, subtract, multiply, divide decimals' },
        { th: 'นำทศนิยมไปใช้กับเรื่องเงินและความยาวได้', en: 'Use decimals with money and length' }
      ] },
      { title: { th: 'แนวคิดหลัก', en: 'Key Ideas' }, subtitle: { th: 'ความเข้าใจพื้นฐาน', en: 'Core understanding' }, bullets: [
        { th: 'ทศนิยมคือเศษส่วนที่เขียนอีกแบบหนึ่ง', en: 'A decimal is another way to write a fraction' },
        { th: 'เลื่อนจุดทศนิยมให้ตรงกันเมื่อบวก-ลบ', en: 'Line up decimal points when adding/subtracting' },
        { th: 'ตรวจคำตอบด้วยการประมาณ', en: 'Check answers by estimation' }
      ] },
      { title: { th: 'ตัวอย่าง', en: 'Examples' }, subtitle: { th: 'บวกและคูณทศนิยม', en: 'Add and multiply decimals' }, bullets: [
        { th: '3.5 + 1.25 = 4.75', en: '3.5 + 1.25 = 4.75' },
        { th: '0.4 × 0.3 = 0.12', en: '0.4 × 0.3 = 0.12' },
        { th: 'บาท 50.50 + บาท 25.75 = บาท 76.25', en: '฿50.50 + ฿25.75 = ฿76.25' }
      ] },
      { title: { th: 'การฝึกปฏิบัติ', en: 'Guided Practice' }, subtitle: { th: 'ทำด้วยกันในชั้นเรียน', en: 'Practice together in class' }, bullets: [
        { th: 'เรียงทศนิยมจากน้อยไปมาก', en: 'Order decimals from least to greatest' },
        { th: 'บวก-ลบเงินในสถานการณ์จำลอง', en: 'Add and subtract money in a role-play' },
        { th: 'แก้โจทย์: 7.8–2.35, 1.5×0.6', en: 'Solve: 7.8–2.35, 1.5×0.6' }
      ] },
      { title: { th: 'สรุปและใบงาน', en: 'Summary and Worksheet' }, subtitle: { th: 'ตรวจความเข้าใจ', en: 'Check understanding' }, bullets: [
        { th: 'ทบทวนทศนิยมและการดำเนินการ', en: 'Review decimals and operations' },
        { th: 'ทำใบงาน "ทศนิยม ป.5"', en: 'Complete the "Decimals P5" worksheet' },
        { th: 'คำถามปิดท้าย: ทศนิยมใช้ที่ไหนในชีวิตจริง?', en: 'Exit question: Where do we use decimals?' }
      ] }
    ]
  },
  {
    id: 'moe-math-p6-01',
    type: 'slides',
    subject: 'Mathematics',
    grade: 'p6',
    topic: { th: 'ร้อยละและอัตราส่วน', en: 'Percentages and Ratios' },
    indicators: ['ค1.1 ป.6/1', 'ค1.1 ป.6/2'],
    outline: [
      { th: 'สไลด์ชื่อเรื่อง', en: 'Title slide' },
      { th: 'จุดประสงค์การเรียนรู้', en: 'Learning objectives' },
      { th: 'แนวคิดหลัก', en: 'Key ideas' },
      { th: 'ตัวอย่าง', en: 'Examples' },
      { th: 'การฝึกปฏิบัติ', en: 'Guided practice' },
      { th: 'สรุปและใบงาน', en: 'Summary and worksheet' }
    ],
    slides: [
      { title: { th: 'ร้อยละและอัตราส่วน', en: 'Percentages and Ratios' }, subtitle: { th: 'คณิตศาสตร์ ชั้น ป.6', en: 'Mathematics, Grade 6' }, bullets: [] },
      { title: { th: 'จุดประสงค์การเรียนรู้', en: 'Learning Objectives' }, subtitle: { th: 'ตัวชี้วัด ค1.1 ป.6/1–2', en: 'Indicators ค1.1 P6/1–2' }, bullets: [
        { th: 'เขียนเศษส่วนและทศนิยมเป็นร้อยละได้', en: 'Convert fractions and decimals to percentages' },
        { th: 'ใช้ร้อยละแก้ปัญหาในชีวิตจริงได้', en: 'Solve real-life problems with percentages' },
        { th: 'บอกอัตราส่วนและใช้บัญญัติไตรยางศ์ได้', en: 'State ratios and use the rule of three' }
      ] },
      { title: { th: 'แนวคิดหลัก', en: 'Key Ideas' }, subtitle: { th: 'ความเข้าใจพื้นฐาน', en: 'Core understanding' }, bullets: [
        { th: 'ร้อยละคือเศษส่วนที่มีตัวส่วนเป็น 100', en: 'A percentage is a fraction out of 100' },
        { th: 'ส่วนลดและภาษีเป็นตัวอย่างที่ใช้บ่อย', en: 'Discounts and tax are common uses' },
        { th: 'อัตราส่วนแสดงความสัมพันธ์ของสองปริมาณ', en: 'A ratio relates two quantities' }
      ] },
      { title: { th: 'ตัวอย่าง', en: 'Examples' }, subtitle: { th: 'ร้อยละในชีวิตจริง', en: 'Percentages in real life' }, bullets: [
        { th: '50% ของ 200 = 100', en: '50% of 200 = 100' },
        { th: 'ลดราคา 20% จาก 300 บาท = 240 บาท', en: '20% off ฿300 = ฿240' },
        { th: 'อัตราส่วนนม:ผง = 2:1', en: 'Milk:powder ratio = 2:1' }
      ] },
      { title: { th: 'การฝึกปฏิบัติ', en: 'Guided Practice' }, subtitle: { th: 'ทำด้วยกันในชั้นเรียน', en: 'Practice together in class' }, bullets: [
        { th: 'แปลงเศษส่วน/ทศนิยมเป็นร้อยละ', en: 'Convert fractions/decimals to percentages' },
        { th: 'คำนวณส่วนลดจากป้ายราคาจริง', en: 'Compute discounts from real price tags' },
        { th: 'แก้โจทย์อัตราส่วน: 3:5 = ?:20', en: 'Solve ratio: 3:5 = ?:20' }
      ] },
      { title: { th: 'สรุปและใบงาน', en: 'Summary and Worksheet' }, subtitle: { th: 'ตรวจความเข้าใจ', en: 'Check understanding' }, bullets: [
        { th: 'ทบทวนร้อยละและอัตราส่วน', en: 'Review percentages and ratios' },
        { th: 'ทำใบงาน "ร้อยละและอัตราส่วน"', en: 'Complete the "Percentages and ratios" worksheet' },
        { th: 'คำถามปิดท้าย: ร้อยละช่วยตัดสินใจซื้ออย่างไร?', en: 'Exit question: How does % help buying decisions?' }
      ] }
    ]
  },
  {
    id: 'moe-math-m1-01',
    type: 'slides',
    subject: 'Mathematics',
    grade: 'm1',
    topic: { th: 'จำนวนเต็มและการดำเนินการ', en: 'Integers and Operations' },
    indicators: ['ค1.1 ม.1/1', 'ค1.1 ม.1/2'],
    outline: [
      { th: 'สไลด์ชื่อเรื่อง', en: 'Title slide' },
      { th: 'จุดประสงค์การเรียนรู้', en: 'Learning objectives' },
      { th: 'แนวคิดหลัก', en: 'Key ideas' },
      { th: 'ตัวอย่าง', en: 'Examples' },
      { th: 'การฝึกปฏิบัติ', en: 'Guided practice' },
      { th: 'สรุปและใบงาน', en: 'Summary and worksheet' }
    ],
    slides: [
      { title: { th: 'จำนวนเต็มและการดำเนินการ', en: 'Integers and Operations' }, subtitle: { th: 'คณิตศาสตร์ ชั้น ม.1', en: 'Mathematics, M.1' }, bullets: [] },
      { title: { th: 'จุดประสงค์การเรียนรู้', en: 'Learning Objectives' }, subtitle: { th: 'ตัวชี้วัด ค1.1 ม.1/1–2', en: 'Indicators ค1.1 M1/1–2' }, bullets: [
        { th: 'บอกสมบัติของจำนวนเต็มได้', en: 'State properties of integers' },
        { th: 'บวก ลบ คูณ หารจำนวนเต็มได้', en: 'Add, subtract, multiply, divide integers' },
        { th: 'ใช้จำนวนเต็มแก้ปัญหาในสถานการณ์จริงได้', en: 'Use integers in real situations' }
      ] },
      { title: { th: 'แนวคิดหลัก', en: 'Key Ideas' }, subtitle: { th: 'ความเข้าใจพื้นฐาน', en: 'Core understanding' }, bullets: [
        { th: 'จำนวนเต็มรวมบวก ลบ และศูนย์', en: 'Integers include positives, negatives, and zero' },
        { th: 'เครื่องหมายแสดงทิศทางบนเส้นจำนวน', en: 'Signs show direction on a number line' },
        { th: 'ลบ × ลบ = บวก เมื่อคูณ-หาร', en: 'Negative × negative = positive when multiplying' }
      ] },
      { title: { th: 'ตัวอย่าง', en: 'Examples' }, subtitle: { th: 'บวกและลบจำนวนเต็ม', en: 'Add and subtract integers' }, bullets: [
        { th: '−5 + 8 = 3', en: '−5 + 8 = 3' },
        { th: '−3 − 4 = −7', en: '−3 − 4 = −7' },
        { th: 'อุณหภูมิ: 5°C ลงไป 8°C = −3°C', en: 'Temp: 5°C down 8°C = −3°C' }
      ] },
      { title: { th: 'การฝึกปฏิบัติ', en: 'Guided Practice' }, subtitle: { th: 'ทำด้วยกันในชั้นเรียน', en: 'Practice together in class' }, bullets: [
        { th: 'วาดเส้นจำนวนแล้วทำเครื่องหมายจำนวนเต็ม', en: 'Draw a number line and mark integers' },
        { th: 'แก้โจทย์: (−6)×3, (−20)÷(−4)', en: 'Solve: (−6)×3, (−20)÷(−4)' },
        { th: 'เกมท้าคำนวณเครื่องหมาย', en: 'Sign-calculating challenge game' }
      ] },
      { title: { th: 'สรุปและใบงาน', en: 'Summary and Worksheet' }, subtitle: { th: 'ตรวจความเข้าใจ', en: 'Check understanding' }, bullets: [
        { th: 'ทบทวนจำนวนเต็มและการดำเนินการ', en: 'Review integers and operations' },
        { th: 'ทำใบงาน "จำนวนเต็ม ม.1"', en: 'Complete the "Integers M.1" worksheet' },
        { th: 'คำถามปิดท้าย: กฎเครื่องหมายคืออะไร?', en: 'Exit question: What is the sign rule?' }
      ] }
    ]
  },
  {
    id: 'moe-math-m2-01',
    type: 'slides',
    subject: 'Mathematics',
    grade: 'm2',
    topic: { th: 'สมการเชิงเส้นตัวแปรเดียว', en: 'Linear Equations in One Variable' },
    indicators: ['ค1.2 ม.2/1', 'ค1.2 ม.2/2'],
    outline: [
      { th: 'สไลด์ชื่อเรื่อง', en: 'Title slide' },
      { th: 'จุดประสงค์การเรียนรู้', en: 'Learning objectives' },
      { th: 'แนวคิดหลัก', en: 'Key ideas' },
      { th: 'ตัวอย่าง', en: 'Examples' },
      { th: 'การฝึกปฏิบัติ', en: 'Guided practice' },
      { th: 'สรุปและใบงาน', en: 'Summary and worksheet' }
    ],
    slides: [
      { title: { th: 'สมการเชิงเส้นตัวแปรเดียว', en: 'Linear Equations in One Variable' }, subtitle: { th: 'คณิตศาสตร์ ชั้น ม.2', en: 'Mathematics, M.2' }, bullets: [] },
      { title: { th: 'จุดประสงค์การเรียนรู้', en: 'Learning Objectives' }, subtitle: { th: 'ตัวชี้วัด ค1.2 ม.2/1–2', en: 'Indicators ค1.2 M2/1–2' }, bullets: [
        { th: 'แก้สมการเชิงเส้นตัวแปรเดียวได้', en: 'Solve linear equations in one variable' },
        { th: 'ตรวจสอบคำตอบโดยแทนค่ากลับได้', en: 'Check answers by substitution' },
        { th: 'นำสมการไปแก้โจทย์ปัญหาได้', en: 'Use equations to solve word problems' }
      ] },
      { title: { th: 'แนวคิดหลัก', en: 'Key Ideas' }, subtitle: { th: 'ความเข้าใจพื้นฐาน', en: 'Core understanding' }, bullets: [
        { th: 'สมการคือประโยคที่มีเครื่องหมาย =', en: 'An equation has an equals sign' },
        { th: 'ทำทั้งสองข้างให้เท่ากันตลอดเวลา', en: 'Keep both sides balanced' },
        { th: 'ย้ายข้างต้องเปลี่ยนเครื่องหมาย', en: 'Moving a term across changes its sign' }
      ] },
      { title: { th: 'ตัวอย่าง', en: 'Examples' }, subtitle: { th: 'แก้สมการ', en: 'Solve equations' }, bullets: [
        { th: '2x + 3 = 11 → x = 4', en: '2x + 3 = 11 → x = 4' },
        { th: 'ตรวจ: 2(4)+3 = 11 ✓', en: 'Check: 2(4)+3 = 11 ✓' },
        { th: 'โจทย์: อายุน้อยกว่าแม่อยู่ 25 ปี', en: 'Problem: child is 25 years younger' }
      ] },
      { title: { th: 'การฝึกปฏิบัติ', en: 'Guided Practice' }, subtitle: { th: 'ทำด้วยกันในชั้นเรียน', en: 'Practice together in class' }, bullets: [
        { th: 'แก้สมการ: 3x−7=8, x/2+5=9', en: 'Solve: 3x−7=8, x/2+5=9' },
        { th: 'ตรวจคำตอบด้วยการแทนค่ากลับ', en: 'Verify by substitution' },
        { th: 'สร้างสมการจากโจทย์สถานการณ์', en: 'Build equations from word problems' }
      ] },
      { title: { th: 'สรุปและใบงาน', en: 'Summary and Worksheet' }, subtitle: { th: 'ตรวจความเข้าใจ', en: 'Check understanding' }, bullets: [
        { th: 'ทบทวนการแก้สมการเชิงเส้น', en: 'Review solving linear equations' },
        { th: 'ทำใบงาน "สมการเชิงเส้น ม.2"', en: 'Complete the "Linear equations M.2" worksheet' },
        { th: 'คำถามปิดท้าย: ทำไมต้องตรวจคำตอบ?', en: 'Exit question: Why check our answer?' }
      ] }
    ]
  },
  {
    id: 'moe-math-m3-01',
    type: 'slides',
    subject: 'Mathematics',
    grade: 'm3',
    topic: { th: 'อสมการเชิงเส้นตัวแปรเดียว', en: 'Linear Inequalities in One Variable' },
    indicators: ['ค1.2 ม.3/1'],
    outline: [
      { th: 'สไลด์ชื่อเรื่อง', en: 'Title slide' },
      { th: 'จุดประสงค์การเรียนรู้', en: 'Learning objectives' },
      { th: 'แนวคิดหลัก', en: 'Key ideas' },
      { th: 'ตัวอย่าง', en: 'Examples' },
      { th: 'การฝึกปฏิบัติ', en: 'Guided practice' },
      { th: 'สรุปและใบงาน', en: 'Summary and worksheet' }
    ],
    slides: [
      { title: { th: 'อสมการเชิงเส้นตัวแปรเดียว', en: 'Linear Inequalities in One Variable' }, subtitle: { th: 'คณิตศาสตร์ ชั้น ม.3', en: 'Mathematics, M.3' }, bullets: [] },
      { title: { th: 'จุดประสงค์การเรียนรู้', en: 'Learning Objectives' }, subtitle: { th: 'ตัวชี้วัด ค1.2 ม.3/1', en: 'Indicator ค1.2 M3/1' }, bullets: [
        { th: 'แก้และแสดงคำตอบของอสมการได้', en: 'Solve and represent solutions of inequalities' },
        { th: 'เขียนเซตคำตอบบนเส้นจำนวนได้', en: 'Graph solution sets on a number line' },
        { th: 'ใช้เครื่องหมาย ≤, ≥, <, > ได้ถูกต้อง', en: 'Use ≤, ≥, <, > correctly' }
      ] },
      { title: { th: 'แนวคิดหลัก', en: 'Key Ideas' }, subtitle: { th: 'ความเข้าใจพื้นฐาน', en: 'Core understanding' }, bullets: [
        { th: 'อสมการแสดงการไม่เท่ากัน', en: 'An inequality shows a non-equal relation' },
        { th: 'การคูณ-หารด้วยจำนวนลบต้องกลับเครื่องหมาย', en: 'Multiplying/dividing by a negative flips the sign' },
        { th: 'คำตอบคือช่วงของจำนวน', en: 'Solutions form a range of numbers' }
      ] },
      { title: { th: 'ตัวอย่าง', en: 'Examples' }, subtitle: { th: 'แก้และวาดกราฟ', en: 'Solve and graph' }, bullets: [
        { th: 'x + 3 > 7 → x > 4', en: 'x + 3 > 7 → x > 4' },
        { th: '−2x ≤ 8 → x ≥ −4', en: '−2x ≤ 8 → x ≥ −4' },
        { th: 'วาดเส้นจำนวนโดยเว้นจุดปลายเปิด', en: 'Graph with an open circle on the endpoint' }
      ] },
      { title: { th: 'การฝึกปฏิบัติ', en: 'Guided Practice' }, subtitle: { th: 'ทำด้วยกันในชั้นเรียน', en: 'Practice together in class' }, bullets: [
        { th: 'แก้อสมการ: 2x−1<7, x/3≥2', en: 'Solve: 2x−1<7, x/3≥2' },
        { th: 'วาดเซตคำตอบบนเส้นจำนวน', en: 'Graph solution sets on number lines' },
        { th: 'โจทย์: ต้องมีคะแนนอย่างน้อยเท่าไร', en: 'Problem: minimum score needed' }
      ] },
      { title: { th: 'สรุปและใบงาน', en: 'Summary and Worksheet' }, subtitle: { th: 'ตรวจความเข้าใจ', en: 'Check understanding' }, bullets: [
        { th: 'ทบทวนอสมการและการวาดกราฟ', en: 'Review inequalities and graphing' },
        { th: 'ทำใบงาน "อสมการเชิงเส้น ม.3"', en: 'Complete the "Linear inequalities M.3" worksheet' },
        { th: 'คำถามปิดท้าย: เมื่อใดต้องกลับเครื่องหมาย?', en: 'Exit question: When do we flip the sign?' }
      ] }
    ]
  },
  {
    id: 'moe-math-m4-01',
    type: 'slides',
    subject: 'Mathematics',
    grade: 'm4',
    topic: { th: 'เซตและการดำเนินการของเซต', en: 'Sets and Set Operations' },
    indicators: ['ค1.2 ม.4/1', 'ค1.2 ม.4/2'],
    outline: [
      { th: 'สไลด์ชื่อเรื่อง', en: 'Title slide' },
      { th: 'จุดประสงค์การเรียนรู้', en: 'Learning objectives' },
      { th: 'แนวคิดหลัก', en: 'Key ideas' },
      { th: 'ตัวอย่าง', en: 'Examples' },
      { th: 'การฝึกปฏิบัติ', en: 'Guided practice' },
      { th: 'สรุปและใบงาน', en: 'Summary and worksheet' }
    ],
    slides: [
      { title: { th: 'เซตและการดำเนินการของเซต', en: 'Sets and Set Operations' }, subtitle: { th: 'คณิตศาสตร์ ชั้น ม.4', en: 'Mathematics, M.4' }, bullets: [] },
      { title: { th: 'จุดประสงค์การเรียนรู้', en: 'Learning Objectives' }, subtitle: { th: 'ตัวชี้วัด ค1.2 ม.4/1–2', en: 'Indicators ค1.2 M4/1–2' }, bullets: [
        { th: 'เขียนเซตแบบแจกแจงสมาชิกและแบบบอกเงื่อนไขได้', en: 'Write sets by roster and set-builder notation' },
        { th: 'หาสมาชิกของเซต ยูเนียน อินเตอร์เซกชันได้', en: 'Find unions, intersections, and members' },
        { th: 'ใช้แผนภาพเวนน์ช่วยแก้ปัญหาได้', en: 'Use Venn diagrams to solve problems' }
      ] },
      { title: { th: 'แนวคิดหลัก', en: 'Key Ideas' }, subtitle: { th: 'ความเข้าใจพื้นฐาน', en: 'Core understanding' }, bullets: [
        { th: 'เซตคือกลุ่มของสิ่งที่ชัดเจนว่าอยู่หรือไม่อยู่', en: 'A set is a well-defined collection' },
        { th: 'ยูเนียนรวมสมาชิกของทั้งสองเซต', en: 'Union combines members of both sets' },
        { th: 'อินเตอร์เซกชันคือสมาชิกที่ซ้ำกัน', en: 'Intersection is the common members' }
      ] },
      { title: { th: 'ตัวอย่าง', en: 'Examples' }, subtitle: { th: 'ยูเนียนและอินเตอร์เซกชัน', en: 'Union and intersection' }, bullets: [
        { th: 'A={1,2,3}, B={3,4,5}', en: 'A={1,2,3}, B={3,4,5}' },
        { th: 'A∪B = {1,2,3,4,5}', en: 'A∪B = {1,2,3,4,5}' },
        { th: 'A∩B = {3}', en: 'A∩B = {3}' }
      ] },
      { title: { th: 'การฝึกปฏิบัติ', en: 'Guided Practice' }, subtitle: { th: 'ทำด้วยกันในชั้นเรียน', en: 'Practice together in class' }, bullets: [
        { th: 'เขียนเซตในรูปแบบต่าง ๆ', en: 'Write sets in different notations' },
        { th: 'วาดแผนภาพเวนน์ของ A∪B และ A∩B', en: 'Draw Venn diagrams of A∪B and A∩B' },
        { th: 'แก้โจทย์การจัดกลุ่มนักเรียน', en: 'Solve a student-grouping problem' }
      ] },
      { title: { th: 'สรุปและใบงาน', en: 'Summary and Worksheet' }, subtitle: { th: 'ตรวจความเข้าใจ', en: 'Check understanding' }, bullets: [
        { th: 'ทบทวนเซตและการดำเนินการ', en: 'Review sets and operations' },
        { th: 'ทำใบงาน "เซต ม.4"', en: 'Complete the "Sets M.4" worksheet' },
        { th: 'คำถามปิดท้าย: อินเตอร์เซกชันคืออะไร?', en: 'Exit question: What is an intersection?' }
      ] }
    ]
  },
  {
    id: 'moe-math-m5-01',
    type: 'slides',
    subject: 'Mathematics',
    grade: 'm5',
    topic: { th: 'ฟังก์ชันและกราฟของฟังก์ชัน', en: 'Functions and Their Graphs' },
    indicators: ['ค1.2 ม.5/1', 'ค1.2 ม.5/2'],
    outline: [
      { th: 'สไลด์ชื่อเรื่อง', en: 'Title slide' },
      { th: 'จุดประสงค์การเรียนรู้', en: 'Learning objectives' },
      { th: 'แนวคิดหลัก', en: 'Key ideas' },
      { th: 'ตัวอย่าง', en: 'Examples' },
      { th: 'การฝึกปฏิบัติ', en: 'Guided practice' },
      { th: 'สรุปและใบงาน', en: 'Summary and worksheet' }
    ],
    slides: [
      { title: { th: 'ฟังก์ชันและกราฟของฟังก์ชัน', en: 'Functions and Their Graphs' }, subtitle: { th: 'คณิตศาสตร์ ชั้น ม.5', en: 'Mathematics, M.5' }, bullets: [] },
      { title: { th: 'จุดประสงค์การเรียนรู้', en: 'Learning Objectives' }, subtitle: { th: 'ตัวชี้วัด ค1.2 ม.5/1–2', en: 'Indicators ค1.2 M5/1–2' }, bullets: [
        { th: 'บอกได้ว่าความสัมพันธ์ใดเป็นฟังก์ชัน', en: 'Identify which relations are functions' },
        { th: 'หาโดเมนและเรนจ์ของฟังก์ชันได้', en: 'Find domain and range' },
        { th: 'วาดและอ่านกราฟของฟังก์ชันได้', en: 'Graph and read function graphs' }
      ] },
      { title: { th: 'แนวคิดหลัก', en: 'Key Ideas' }, subtitle: { th: 'ความเข้าใจพื้นฐาน', en: 'Core understanding' }, bullets: [
        { th: 'ฟังก์ชันจับคู่ค่า x หนึ่งค่ากับค่า y ค่าเดียว', en: 'A function maps each x to one y' },
        { th: 'โดเมนคือค่า x ที่เป็นไปได้', en: 'Domain is the possible x values' },
        { th: 'เรนจ์คือค่า y ที่เกิดจริง', en: 'Range is the resulting y values' }
      ] },
      { title: { th: 'ตัวอย่าง', en: 'Examples' }, subtitle: { th: 'ฟังก์ชันเส้นตรง', en: 'Linear function' }, bullets: [
        { th: 'f(x) = 2x + 1', en: 'f(x) = 2x + 1' },
        { th: 'f(3) = 7', en: 'f(3) = 7' },
        { th: 'กราฟเป็นเส้นตรงลาดขึ้น', en: 'The graph is a rising straight line' }
      ] },
      { title: { th: 'การฝึกปฏิบัติ', en: 'Guided Practice' }, subtitle: { th: 'ทำด้วยกันในชั้นเรียน', en: 'Practice together in class' }, bullets: [
        { th: 'ทดสอบว่าเป็นฟังก์ชันหรือไม่ด้วยเส้นตั้ง', en: 'Use the vertical-line test' },
        { th: 'หาโดเมนและเรนจ์ของ f(x)=x²–1', en: 'Find domain/range of f(x)=x²–1' },
        { th: 'วาดกราฟจากตารางค่าที่กำหนด', en: 'Graph from a table of values' }
      ] },
      { title: { th: 'สรุปและใบงาน', en: 'Summary and Worksheet' }, subtitle: { th: 'ตรวจความเข้าใจ', en: 'Check understanding' }, bullets: [
        { th: 'ทบทวนฟังก์ชัน โดเมน และเรนจ์', en: 'Review functions, domain, and range' },
        { th: 'ทำใบงาน "ฟังก์ชัน ม.5"', en: 'Complete the "Functions M.5" worksheet' },
        { th: 'คำถามปิดท้าย: เส้นตั้งใช้ตรวจอะไร?', en: 'Exit question: What does the vertical line check?' }
      ] }
    ]
  },
  {
    id: 'moe-math-m6-01',
    type: 'slides',
    subject: 'Mathematics',
    grade: 'm6',
    topic: { th: 'แคลคูลัสเบื้องต้น: ลิมิตและอนุพันธ์', en: 'Introduction to Calculus: Limits and Derivatives' },
    indicators: ['ค1.2 ม.6/1', 'ค1.2 ม.6/2'],
    outline: [
      { th: 'สไลด์ชื่อเรื่อง', en: 'Title slide' },
      { th: 'จุดประสงค์การเรียนรู้', en: 'Learning objectives' },
      { th: 'แนวคิดหลัก', en: 'Key ideas' },
      { th: 'ตัวอย่าง', en: 'Examples' },
      { th: 'การฝึกปฏิบัติ', en: 'Guided practice' },
      { th: 'สรุปและใบงาน', en: 'Summary and worksheet' }
    ],
    slides: [
      { title: { th: 'ลิมิตและอนุพันธ์ของฟังก์ชัน', en: 'Limits and Derivatives of Functions' }, subtitle: { th: 'คณิตศาสตร์ ชั้น ม.6', en: 'Mathematics, M.6' }, bullets: [] },
      { title: { th: 'จุดประสงค์การเรียนรู้', en: 'Learning Objectives' }, subtitle: { th: 'ตัวชี้วัด ค1.2 ม.6/1–2', en: 'Indicators ค1.2 M6/1–2' }, bullets: [
        { th: 'หาลิมิตของฟังก์ชันที่กำหนดได้', en: 'Find limits of given functions' },
        { th: 'หาอนุพันธ์ของฟังก์ชันพหุนามได้', en: 'Differentiate polynomial functions' },
        { th: 'ใช้อนุพันธ์หาความชันของเส้นโค้งได้', en: 'Use derivatives to find slopes' }
      ] },
      { title: { th: 'แนวคิดหลัก', en: 'Key Ideas' }, subtitle: { th: 'ความเข้าใจพื้นฐาน', en: 'Core understanding' }, bullets: [
        { th: 'ลิมิตคือค่าใกล้เคียงเมื่อ x เข้าใกล้จุดหนึ่ง', en: 'A limit is the value approached as x nears a point' },
        { th: 'อนุพันธ์คือความชันของเส้นสัมผัส', en: 'The derivative is the slope of the tangent' },
        { th: 'กฎกำลัง: d/dx (xⁿ) = nxⁿ⁻¹', en: 'Power rule: d/dx (xⁿ) = nxⁿ⁻¹' }
      ] },
      { title: { th: 'ตัวอย่าง', en: 'Examples' }, subtitle: { th: 'ลิมิตและอนุพันธ์', en: 'Limits and derivatives' }, bullets: [
        { th: 'lim(x→2) 3x = 6', en: 'lim(x→2) 3x = 6' },
        { th: 'f(x)=x² → f′(x)=2x', en: 'f(x)=x² → f′(x)=2x' },
        { th: 'ความชันที่ x=3 คือ 6', en: 'Slope at x=3 is 6' }
      ] },
      { title: { th: 'การฝึกปฏิบัติ', en: 'Guided Practice' }, subtitle: { th: 'ทำด้วยกันในชั้นเรียน', en: 'Practice together in class' }, bullets: [
        { th: 'หาลิมิต: lim(x→1) (2x+3)', en: 'Find limit: lim(x→1) (2x+3)' },
        { th: 'หาอนุพันธ์: f(x)=3x³–x²+2', en: 'Differentiate: f(x)=3x³–x²+2' },
        { th: 'ตีความอนุพันธ์เป็นความชัน', en: 'Interpret the derivative as slope' }
      ] },
      { title: { th: 'สรุปและใบงาน', en: 'Summary and Worksheet' }, subtitle: { th: 'ตรวจความเข้าใจ', en: 'Check understanding' }, bullets: [
        { th: 'ทบทวนลิมิตและอนุพันธ์', en: 'Review limits and derivatives' },
        { th: 'ทำใบงาน "แคลคูลัสเบื้องต้น ม.6"', en: 'Complete the "Intro to calculus M.6" worksheet' },
        { th: 'คำถามปิดท้าย: อนุพันธ์บอกอะไรเรา?', en: 'Exit question: What does the derivative tell us?' }
      ] }
    ]
  }
];
```

- [ ] **Step 2: Create `src/data/curriculum/index.js`** that aggregates this and the future subject files:

```js
import { MATH } from './Math.js';

export const TEMPLATES = [
  ...MATH
];

export function findTemplateById(id) {
  return TEMPLATES.find(t => t.id === id) || null;
}
```

- [ ] **Step 3: Create `scripts/verify-curriculum.mjs`** to assert the data shape (each task adds its subject import to the check):

```js
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
```

- [ ] **Step 4: Run the verify script** — expects at least 144 templates. It currently finds only 12 (Math). Update the assertion to `>= 12` temporarily OR (preferred) run with a loose expected count and confirm it PASSes for the Math file, then strengthen to `>= 144` in the final content task. To keep every commit green, set the threshold to `>= 12` now and raise it to `>= 144` in Task 9.

Run: `node scripts/verify-curriculum.mjs`
Expected: PASS (12 templates)

- [ ] **Step 5: Commit**

```bash
git add src/data/curriculum/index.js src/data/curriculum/Math.js scripts/verify-curriculum.mjs
git commit -m "feat(curriculum): add curriculum data infrastructure and Math templates"
```

---

### Task 2: i18n keys for the template tab

**Files:**
- Modify: `src/services/i18n.js` (add keys in `en` block near line 135 and in `th` block near line 301)

**Interfaces:**
- Consumes: existing `t(key)` function.
- Produces: i18n keys used by Tasks 4–6:
  - `lib.tabMine`, `lib.tabTemplates`, `lib.templateSearchPh`, `lib.templateAllGrade`, `lib.templateNoResults`, `lib.templateBadge`, `lib.templateSave`, `lib.templateDisclaimer`, `content.saveToLibrary`, `content.toastSavedTemplate`

- [ ] **Step 1: Add English keys.** After the existing `lib.open` line (line 135) add:

```js
    'lib.tabMine': 'My materials',
    'lib.tabTemplates': 'MOE Curriculum Templates',
    'lib.templateSearchPh': 'Search templates by topic or indicator...',
    'lib.templateAllGrade': 'All grades',
    'lib.templateNoResults': 'No templates match your search.',
    'lib.templateBadge': 'Template สพฐ.',
    'lib.templateSave': 'Save to library',
    'lib.templateDisclaimer': 'Indicators compiled from the MOE curriculum; please verify against the official version before use.',
    'content.saveToLibrary': 'Save to library',
    'content.toastSavedTemplate': 'Template saved to your library',
```

- [ ] **Step 2: Add Thai keys.** After the existing `lib.open` line (line 301) add:

```js
    'lib.tabMine': 'เนื้อหาของฉัน',
    'lib.tabTemplates': 'เทมเพลตหลักสูตร สพฐ.',
    'lib.templateSearchPh': 'ค้นหาเทมเพลตตามหัวข้อหรือตัวชี้วัด...',
    'lib.templateAllGrade': 'ทุกชั้น',
    'lib.templateNoResults': 'ไม่มีเทมเพลตที่ตรงกับที่ค้นหา',
    'lib.templateBadge': 'เทมเพลต สพฐ.',
    'lib.templateSave': 'บันทึกเข้า Library',
    'lib.templateDisclaimer': 'เนื้อหาตัวชี้วัดรวบรวมตามหลักสูตร สพฐ. ควรตรวจทานกับฉบับทางการก่อนนำไปใช้',
    'content.saveToLibrary': 'บันทึกเข้า Library',
    'content.toastSavedTemplate': 'บันทึกเทมเพลตลงในคลังของคุณแล้ว',
```

- [ ] **Step 3: Verify** the keys exist via the existing verify script:

Run: `node scripts/verify-level-subject.mjs`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/services/i18n.js
git commit -m "feat(i18n): add template tab and save-to-library strings"
```

---

### Task 3: Bilingual slides renderer

**Files:**
- Modify: `src/components/ItemRenderers.jsx` (renderSlides at line 195 and renderItemBody at line 235)
- Modify: `src/pages/ContentViewPage.jsx` (pass `lang` to renderItemBody at line 85)

**Interfaces:**
- Consumes: `useI18n` context (`lang`) from `src/context/I18nContext.jsx`.
- Produces:
  - `function loc(v, lang)` — returns `v[lang] || v.en || v.th || v` for `{th,en}` objects, or the plain string unchanged.
  - `renderItemBody(item, lang)` — signature gains a second `lang` param.
  - `renderSlides(item, lang)` — resolves every `{th,en}` field.

- [ ] **Step 1: Add the `loc` helper** at the top of `ItemRenderers.jsx` after the imports:

```js
export function loc(v, lang) {
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    return v[lang] || v.en || v.th || '';
  }
  return v == null ? '' : v;
}
```

- [ ] **Step 2: Update `renderSlides`** so the title, subtitle, and bullets resolve via `loc`. Replace lines 195–233:

```jsx
export function renderSlides(item, lang) {
  return (
    <>
      <div className="card p-6">
        <h2 className="font-semibold text-lg mb-1">{loc(item.title, lang)}</h2>
        <p className="text-sm text-muted mb-5">
          {loc(item.grade, lang) || ''} · {item.subject || ''} · {item.slides.length} slides
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {item.slides.map((s, i) => (
          <div key={i} className={'aspect-[4/3] rounded-2xl p-6 flex flex-col justify-between ' + (i % 2 ? 'bg-dark text-white' : 'bg-white border border-line') + ' overflow-hidden'}>
            <div className="flex items-center justify-between">
              <span className={'text-xs font-semibold ' + (i % 2 ? 'text-white/60' : 'text-muted')}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={'w-8 h-8 ' + (i % 2 ? 'bg-primary/20' : 'bg-peach/60') + ' rounded-lg'}></span>
            </div>
            <div>
              {s.subtitle && (
                <p className="text-xs mb-2 text-primary">{loc(s.subtitle, lang)}</p>
              )}
              <h3 className="font-semibold text-xl leading-snug mb-3">{loc(s.title, lang)}</h3>
              {s.bullets.length > 0 && (
                <ul className="space-y-1.5 text-sm opacity-90">
                  {s.bullets.map((b, j) => (
                    <li key={j} className="flex gap-2">
                      <span className="text-primary">•</span> {loc(b, lang)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
```

- [ ] **Step 3: Update `renderItemBody`** to accept and forward `lang`:

```jsx
export function renderItemBody(item, lang) {
  switch (item.type) {
    case 'lesson': return renderLesson(item);
    case 'worksheet': return renderWorksheet(item);
    case 'quiz': return renderQuiz(item);
    case 'rubric': return renderRubric(item);
    case 'activity': return renderActivity(item);
    default: return renderSlides(item, lang);
  }
}
```

- [ ] **Step 4: Update ContentViewPage** to pass `lang`. In `ContentViewPage.jsx`, add `lang` from `useI18n` and pass it at line 85:

```jsx
const { t, lang } = useI18n();
...
<div id="content-body" ref={contentBodyRef} className="space-y-6">{renderItemBody(item, lang)}</div>
```

- [ ] **Step 5: Build** to confirm no syntax errors:

Run: `npm run build`
Expected: build succeeds

- [ ] **Step 6: Commit**

```bash
git add src/components/ItemRenderers.jsx src/pages/ContentViewPage.jsx
git commit -m "feat(render): support bilingual slides content"
```

---

### Task 4: Store fallback to curriculum templates + save clone

**Files:**
- Modify: `src/services/store.js` (find at line 22-27)

**Interfaces:**
- Consumes: `findTemplateById` from `src/data/curriculum/index.js`.
- Produces:
  - `STORE.find(id)` returns `null` OR a library item OR a Live item OR a curriculum template (with `isTemplate: true` set on the template copy).
  - `STORE.cloneTemplate(template)` — returns a new item with a fresh id, stamped timestamps, `isTemplate: false`.

- [ ] **Step 1: Import `findTemplateById`** at the top of `store.js`:

```js
import { findTemplateById } from '../data/curriculum/index.js';
```

- [ ] **Step 2: Update `STORE.find`** to fall back to templates and flag them:

```js
  find(id) {
    const lib = this.getLibrary();
    const item = lib.find(i => i.id === id);
    if (item) return item;
    const live = Live.get(id);
    if (live) return live;
    const tpl = findTemplateById(id);
    if (tpl) return Object.assign({}, tpl, { isTemplate: true });
    return null;
  },
```

- [ ] **Step 3: Add `STORE.cloneTemplate`** (place after `save`, before `delete`):

```js
  cloneTemplate(template) {
    const copy = Object.assign({}, template, {
      id: crypto.randomUUID ? crypto.randomUUID() : 'tpl-' + Date.now() + '-' + Math.random().toString(36).slice(2),
      isTemplate: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    return this.save(copy);
  },
```

- [ ] **Step 4: Build** to confirm the import graph resolves (index.js is a pure data module — no React):

Run: `npm run build`
Expected: build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/services/store.js
git commit -m "feat(store): resolve curriculum templates in find and clone on save"
```

---

### Task 5: ContentView save-to-library for templates

**Files:**
- Modify: `src/pages/ContentViewPage.jsx`

**Interfaces:**
- Consumes: `STORE.cloneTemplate` (Task 4), `t('content.saveToLibrary')`, `t('content.toastSavedTemplate')` (Task 2).
- Produces: For template items, the primary button reads "Save to library" and creates an independent copy.

- [ ] **Step 1: Update the save handler** so templates use `cloneTemplate`:

```jsx
  const onSave = () => {
    if (item.isTemplate) {
      STORE.cloneTemplate(item);
      toast(t('content.toastSavedTemplate'), 'ok');
      setTick(n => n + 1);
      return;
    }
    STORE.save(item);
    toast(t('content.toastSaved'), 'ok');
    setTick(n => n + 1);
  };
```

- [ ] **Step 2: Update the save button label and saved-state logic.** For a template, `isSaved` is false and the label should be `content.saveToLibrary`:

```jsx
  const isSaved = !!STORE.itemById(item.id) && !item.isTemplate;
  ...
  <button
    id="content-save"
    className={'btn btn-primary' + (isSaved ? ' opacity-70' : '')}
    onClick={onSave}
  >
    {item.isTemplate ? t('content.saveToLibrary') : (isSaved ? t('content.savedBadge') : t('content.save'))}
  </button>
```

- [ ] **Step 3: Build:**

Run: `npm run build`
Expected: build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/pages/ContentViewPage.jsx
git commit -m "feat(content): save-to-library action for curriculum templates"
```

---

### Task 6: Library page — tab switcher + template grid

**Files:**
- Modify: `src/pages/LibraryPage.jsx`

**Interfaces:**
- Consumes: `TEMPLATES` from `src/data/curriculum/index.js`, `LEVELS` from `src/data/types.js`, i18n keys from Task 2, `useI18n().lang`.
- Produces: Two-tab Library page; template tab renders `TEMPLATE_CARDS` (see below) with search + subject + grade filters.

- [ ] **Step 1: Extend imports** in `LibraryPage.jsx`:

```jsx
import { TEMPLATES } from '../data/curriculum/index.js';
import { LEVELS } from '../data/types.js';
```

- [ ] **Step 2: Add template-tab state and derived data.** After the existing state (line 38) add:

```jsx
  const [tab, setTab] = useState('mine');
  const [tplQ, setTplQ] = useState('');
  const [tplSubj, setTplSubj] = useState('');
  const [tplGrade, setTplGrade] = useState('');

  const tplFiltered = TEMPLATES.filter(t => {
    const q = tplQ.trim().toLowerCase();
    const hay = [t.topic.th, t.topic.en, t.subject, ...(t.indicators || [])].join(' ').toLowerCase();
    if (q && !hay.includes(q)) return false;
    if (tplSubj && t.subject !== tplSubj) return false;
    if (tplGrade && t.grade !== tplGrade) return false;
    return true;
  });
```

- [ ] **Step 3: Add a tab switcher** directly under the header block (after line 82, the `</div>` closing the header row):

```jsx
      <div className="flex gap-2 mb-6" role="tablist">
        <button
          role="tab"
          aria-selected={tab === 'mine'}
          className={'chip ' + (tab === 'mine' ? 'chip-active' : '')}
          onClick={() => setTab('mine')}
        >
          {t('lib.tabMine')}
        </button>
        <button
          role="tab"
          aria-selected={tab === 'templates'}
          className={'chip ' + (tab === 'templates' ? 'chip-active' : '')}
          onClick={() => setTab('templates')}
        >
          {t('lib.tabTemplates')}
        </button>
      </div>
```

- [ ] **Step 4: Wrap the existing "my materials" UI (search/filters/grid/empty) in** `{tab === 'mine' && ( ... )}` and add the template tab UI after it:

```jsx
      {tab === 'templates' && (
        <div>
          <p className="text-xs text-muted mb-3">{t('lib.templateDisclaimer')}</p>
          <div className="rounded-2xl bg-white border border-line shadow-card p-4 mb-6 flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">⌕</span>
              <input
                type="search"
                className="input pl-9"
                placeholder={t('lib.templateSearchPh')}
                value={tplQ}
                onChange={e => setTplQ(e.target.value)}
              />
            </div>
            <select className="input md:w-52" value={tplSubj} onChange={e => setTplSubj(e.target.value)}>
              <option value="">{t('lib.allSub')}</option>
              {SUBJECTS.map(s => (
                <option key={s.value} value={s.value}>{t(s.key)}</option>
              ))}
            </select>
            <select className="input md:w-52" value={tplGrade} onChange={e => setTplGrade(e.target.value)}>
              <option value="">{t('lib.templateAllGrade')}</option>
              {LEVELS.filter(l => l.value !== 'k').map(l => (
                <option key={l.value} value={l.value}>{levelLabel(l.value, lang)}</option>
              ))}
            </select>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tplFiltered.map(tp => (
              <div key={tp.id} className="card card-hover overflow-hidden flex flex-col">
                <button
                  className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={() => navigate('/content/' + tp.id)}
                >
                  <img src={assetFor('slides')} alt="" className="w-full aspect-[4/3] object-contain p-2 border-b border-line bg-soft/40" />
                </button>
                <div className="p-4 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={'inline-block text-[11px] px-2 py-0.5 rounded-full ' + chipColor('slides')}>{t('lib.templateBadge')}</span>
                  </div>
                  <p className="font-semibold leading-snug mb-1">{loc(tp.topic, lang)}</p>
                  <p className="text-xs text-muted">{levelLabel(tp.grade, lang)} · {t(SUBJECTS.find(s => s.value === tp.subject)?.key || tp.subject)}</p>
                  {tp.indicators.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tp.indicators.map((ind, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-soft text-muted max-w-full truncate" title={ind}>{ind}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="px-4 pb-4">
                  <button className="btn btn-secondary w-full text-sm" onClick={() => navigate('/content/' + tp.id)}>{t('lib.open')}</button>
                </div>
              </div>
            ))}
            {tplFiltered.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted text-sm">{t('lib.templateNoResults')}</div>
            )}
          </div>
        </div>
      )}
```

- [ ] **Step 5: Add the missing imports and lang.** `loc` comes from `ItemRenderers.jsx`; `levelLabel` from `types.js`. Update the `useI18n` destructure to also pull `lang`:

```jsx
import { levelLabel } from '../data/types.js';
import { loc } from '../components/ItemRenderers.jsx';
```

Change line 28 `const { t } = useI18n();` to `const { t, lang } = useI18n();`.

- [ ] **Step 6: Build:**

Run: `npm run build`
Expected: build succeeds

- [ ] **Step 7: Commit**

```bash
git add src/pages/LibraryPage.jsx
git commit -m "feat(library): add MOE curriculum templates tab with filters"
```

---

### Task 7: Content — Thai, English, Science

**Files:**
- Create: `src/data/curriculum/Thai.js`
- Create: `src/data/curriculum/English.js`
- Create: `src/data/curriculum/Science.js`
- Modify: `src/data/curriculum/index.js` (import + spread the three new arrays)

**Interfaces:**
- Consumes: template shape defined in Task 1, `findTemplateById` already wired.
- Produces: `export const THAI`, `export const ENGLISH`, `export const SCIENCE` — each 12 entries (p1–m6), bilingual, 5–8 slides per entry. Follow the Math.js structure exactly (outline + 6 slides per template, `{th,en}` everywhere).

- [ ] **Step 1: Create `src/data/curriculum/Thai.js`** — 12 templates, one per grade. Use these topics (th/en) and indicator codes per grade:
  - p1: ทักษะการฟังและการพูด — Listening and Speaking (ท1.1 ป.1/1–3)
  - p2: การอ่านคำและข้อความสั้น — Reading Words and Short Texts (ท1.1 ป.2/1–2)
  - p3: ชนิดของคำ — Word Classes (ท4.1 ป.3/1–2)
  - p4: การอ่านจับใจความ — Reading Comprehension (ท1.1 ป.4/1–3)
  - p5: หลักการใช้ภาษาไทย — Thai Language Usage (ท4.1 ป.5/1–3)
  - p6: การเขียนเรียงความและย่อความ — Essay and Summary Writing (ท2.1 ป.6/1–2)
  - m1: วรรณคดีและวรรณกรรม — Literature and Literary Works (ท5.1 ม.1/1–2)
  - m2: การพูดในโอกาสต่าง ๆ — Speaking in Various Occasions (ท3.1 ม.2/1–2)
  - m3: การวิเคราะห์วรรณคดี — Literary Analysis (ท5.1 ม.3/1–2)
  - m4: ภาษาและวัฒนธรรม — Language and Culture (ท4.1 ม.4/1–2)
  - m5: การวิจารณ์วรรณกรรม — Literary Criticism (ท5.1 ม.5/1–2)
  - m6: วรรณคดีวิจักษ์ — Appreciating Literature (ท5.1 ม.6/1–2)
  Each template: 6 slides (title / objectives / key ideas / example / guided practice / summary) with Thai-focused bilingual copy, matching the Math.js slide count and field shape.

- [ ] **Step 2: Create `src/data/curriculum/English.js`** — 12 templates, one per grade. Topics (th/en) + indicators per grade:
  - p1: Greetings and Self-Introduction — การทักทายและการแนะนำตัว (ต1.1 ป.1/1–2)
  - p2: Numbers and Colors — จำนวนนับและสี (ต1.1 ป.2/1–2)
  - p3: Family and Food — ครอบครัวและอาหาร (ต1.2 ป.3/1)
  - p4: Daily Routines — กิจวัตรประจำวัน (ต1.1 ป.4/1–2)
  - p5: Places and Directions — สถานที่และทิศทาง (ต1.2 ป.5/1–2)
  - p6: Festivals and Culture — เทศกาลและวัฒนธรรม (ต2.1 ป.6/1–2)
  - m1: School Life Vocabulary — คำศัพท์เกี่ยวกับชีวิตในโรงเรียน (ต1.1 ม.1/1–2)
  - m2: Shopping and Money — การซื้อของและเงินตรา (ต1.2 ม.2/1–2)
  - m3: Travel and Tourism — การเดินทางและท่องเที่ยว (ต1.3 ม.3/1)
  - m4: Describing People and Places — การบรรยายบุคคลและสถานที่ (ต1.1 ม.4/1–2)
  - m5: Opinions and Discussion — การแสดงความคิดเห็น (ต1.3 ม.5/1–2)
  - m6: Current Events and Media — เหตุการณ์ปัจจุบันและสื่อ (ต2.2 ม.6/1–2)
  Bilingual copy: slide titles/bullets in Thai AND English (e.g. title `{ th: 'การทักทาย', en: 'Greetings' }`).

- [ ] **Step 3: Create `src/data/curriculum/Science.js`** — 12 templates, one per grade. Topics (th/en) + indicators per grade:
  - p1: Plants and Their Parts — พืชและส่วนประกอบของพืช (ว1.1 ป.1/1–2)
  - p2: Animals and Habitats — สัตว์และแหล่งที่อยู่ (ว1.2 ป.2/1–2)
  - p3: Matter and Its States — สสารและสถานะ (ว2.1 ป.3/1–2)
  - p4: Plants and Life Cycles — วงจรชีวิตของพืช (ว1.1 ป.4/1–3)
  - p5: The Solar System — ระบบสุริยะ (ว7.1 ป.5/1–2)
  - p6: Forces and Motion — แรงและการเคลื่อนที่ (ว2.2 ป.6/1–2)
  - m1: Cells and Living Things — เซลล์และสิ่งมีชีวิต (ว1.1 ม.1/1–3)
  - m2: Chemical Reactions — ปฏิกิริยาเคมี (ว2.1 ม.2/1–2)
  - m3: Electricity — ไฟฟ้า (ว5.1 ม.3/1–3)
  - m4: Genetics and Heredity — พันธุศาสตร์ (ว1.1 ม.4/1–2)
  - m5: Organic Chemistry — เคมีอินทรีย์ (ว2.1 ม.5/1–2)
  - m6: Energy and Climate — พลังงานและภูมิอากาศ (ว3.1 ม.6/1–2)

- [ ] **Step 4: Update `src/data/curriculum/index.js`:**

```js
import { MATH } from './Math.js';
import { THAI } from './Thai.js';
import { ENGLISH } from './English.js';
import { SCIENCE } from './Science.js';

export const TEMPLATES = [
  ...MATH,
  ...THAI,
  ...ENGLISH,
  ...SCIENCE
];
```

- [ ] **Step 5: Raise the verify threshold** from `>= 12` to `>= 48` (Math+Thai+English+Science = 48) in `scripts/verify-curriculum.mjs` and run it:

Run: `node scripts/verify-curriculum.mjs`
Expected: PASS (48 templates)

- [ ] **Step 6: Commit**

```bash
git add src/data/curriculum/Thai.js src/data/curriculum/English.js src/data/curriculum/Science.js src/data/curriculum/index.js scripts/verify-curriculum.mjs
git commit -m "feat(curriculum): add Thai, English, Science templates"
```

---

### Task 8: Content — Social Studies, Physics, Chemistry, Biology, History, Geography, Computing

**Files:**
- Create: `src/data/curriculum/SocialStudies.js`
- Create: `src/data/curriculum/Physics.js`
- Create: `src/data/curriculum/Chemistry.js`
- Create: `src/data/curriculum/Biology.js`
- Create: `src/data/curriculum/History.js`
- Create: `src/data/curriculum/Geography.js`
- Create: `src/data/curriculum/Computing.js`
- Modify: `src/data/curriculum/index.js`

**Interfaces:**
- Consumes: template shape defined in Task 1.
- Produces: seven more `export const` arrays (12 entries each), matching Math.js structure.

- [ ] **Step 1: Create `src/data/curriculum/SocialStudies.js`** — topics (th/en) + indicators per grade:
  - p1: ครอบครัวของฉัน — My Family (ส1.1 ป.1/1–2)
  - p2: ชุมชนของเรา — Our Community (ส2.1 ป.2/1–2)
  - p3: สิทธิและหน้าที่ของนักเรียน — Rights and Duties of Students (ส1.1 ป.3/1–2)
  - p4: ภูมิภาคของประเทศไทย — Regions of Thailand (ส5.1 ป.4/1–2)
  - p5: เศรษฐกิจพอเพียง — Sufficiency Economy (ส3.1 ป.5/1–2)
  - p6: ประเพณีและวัฒนธรรมไทย — Thai Traditions and Culture (ส4.1 ป.6/1–2)
  - m1: สังคมและวัฒนธรรม — Society and Culture (ส4.1 ม.1/1–2)
  - m2: เศรษฐศาสตร์ในชีวิตประจำวัน — Economics in Daily Life (ส3.1 ม.2/1–2)
  - m3: สิทธิมนุษยชนและกฎหมาย — Human Rights and Law (ส2.1 ม.3/1–2)
  - m4: รัฐศาสตร์เบื้องต้น — Introduction to Politics (ส2.1 ม.4/1–2)
  - m5: เศรษฐศาสตร์มหภาค — Macroeconomics (ส3.1 ม.5/1–2)
  - m6: ปรัชญาและศาสนา — Philosophy and Religion (ส1.1 ม.6/1–2)

- [ ] **Step 2: Create `src/data/curriculum/Physics.js`** — topics + indicators per grade:
  - p1–p6: Physics is a high-school subject; for primary grades there is no separate Physics course. **Alternative rule for this file (and Chemistry/Biology): cover grades m1–m6 only where the MOE upper-secondary science strands apply, but the plan requires 12 entries per subject file.** Therefore: create entries for m1–m6 with strand-based topics, and for p1–p6 reuse grade-appropriate science topics drawn from the Science strand (ว2.2) that map to physics concepts (e.g. p3: แรงและการเคลื่อนที่ — Forces and Motion). This keeps the required 12 entries while remaining curriculum-plausible.
  - p1: การเล่นและการเคลื่อนที่ — Play and Motion (ว2.2 ป.1/1–2)
  - p2: แสงและเงา — Light and Shadows (ว2.3 ป.2/1–2)
  - p3: เสียงและการได้ยิน — Sound and Hearing (ว2.3 ป.3/1–2)
  - p4: แรงและเครื่องกลอย่างง่าย — Forces and Simple Machines (ว2.2 ป.4/1–2)
  - p5: ไฟฟ้าสถิตเบื้องต้น — Basic Static Electricity (ว5.1 ป.5/1–2)
  - p6: แสงและการมองเห็น — Light and Vision (ว2.3 ป.6/1–2)
  - m1: การวัดและหน่วย — Measurement and Units (ว2.1 ม.1/1)
  - m2: ความดัน — Pressure (ว2.2 ม.2/1–2)
  - m3: งานและพลังงาน — Work and Energy (ว2.2 ม.3/1–2)
  - m4: กลศาสตร์ — Mechanics (ว2.2 ม.4/1–3)
  - m5: ไฟฟ้ากระแสและแม่เหล็ก — Current Electricity and Magnetism (ว5.1 ม.5/1–3)
  - m6: ฟิสิกส์ควอนตัมเบื้องต้น — Introduction to Quantum Physics (ว2.3 ม.6/1–2)

- [ ] **Step 3: Create `src/data/curriculum/Chemistry.js`** — topics + indicators per grade:
  - p1: สสารรอบตัวเรา — Matter Around Us (ว2.1 ป.1/1–2)
  - p2: การเปลี่ยนแปลงของสสาร — Changes in Matter (ว2.1 ป.2/1–2)
  - p3: การละลาย — Dissolving (ว2.1 ป.3/1–2)
  - p4: สารและการแยกสาร — Substances and Separation (ว2.1 ป.4/1–2)
  - p5: สารในชีวิตประจำวัน — Everyday Substances (ว2.1 ป.5/1–2)
  - p6: การเปลี่ยนสถานะ — Changes of State (ว2.1 ป.6/1–2)
  - m1: ธาตุและสารประกอบ — Elements and Compounds (ว2.1 ม.1/1–2)
  - m2: สารละลาย — Solutions (ว2.1 ม.2/1–2)
  - m3: อะตอมและโมเลกุล — Atoms and Molecules (ว2.1 ม.3/1–2)
  - m4: พันธะเคมี — Chemical Bonding (ว2.1 ม.4/1–2)
  - m5: กรด-เบส — Acids and Bases (ว2.1 ม.5/1–2)
  - m6: เคมีอินทรีย์และพอลิเมอร์ — Organic Chemistry and Polymers (ว2.1 ม.6/1–2)

- [ ] **Step 4: Create `src/data/curriculum/Biology.js`** — topics + indicators per grade:
  - p1: สัตว์รอบตัว — Animals Around Us (ว1.2 ป.1/1–2)
  - p2: พืชในโรงเรียน — Plants at School (ว1.1 ป.2/1–2)
  - p3: ร่างกายของเรา — Our Body (ว1.2 ป.3/1–2)
  - p4: ระบบย่อยอาหาร — The Digestive System (ว1.2 ป.4/1–2)
  - p5: การสืบพันธุ์ของพืช — Plant Reproduction (ว1.1 ป.5/1–2)
  - p6: ระบบนิเวศ — Ecosystems (ว1.3 ป.6/1–2)
  - m1: การดำรงชีวิตของพืช — Plant Life Processes (ว1.1 ม.1/1–2)
  - m2: ระบบต่าง ๆ ของมนุษย์ — Human Body Systems (ว1.2 ม.2/1–2)
  - m3: พันธุศาสตร์เบื้องต้น — Introduction to Genetics (ว1.3 ม.3/1–2)
  - m4: เซลล์และเนื้อเยื่อ — Cells and Tissues (ว1.1 ม.4/1–3)
  - m5: วิวัฒนาการ — Evolution (ว1.3 ม.5/1–2)
  - m6: สรีรวิทยาของมนุษย์ — Human Physiology (ว1.2 ม.6/1–2)

- [ ] **Step 5: Create `src/data/curriculum/History.js`** — topics + indicators per grade (subject value `'History'`):
  - p1: เวลาและเหตุการณ์ — Time and Events (ส4.1 ป.1/1–2)
  - p2: บุคคลสำคัญในท้องถิ่น — Local Notable People (ส4.2 ป.2/1–2)
  - p3: ประวัติศาสตร์ท้องถิ่น — Local History (ส4.2 ป.3/1–2)
  - p4: ประวัติศาสตร์ไทยสมัยสุโขทัย — Sukhothai Period (ส4.1 ป.4/1–2)
  - p5: อยุธยาและธนบุรี — Ayutthaya and Thonburi (ส4.1 ป.5/1–2)
  - p6: กรุงรัตนโกสินทร์ — Rattanakosin Period (ส4.1 ป.6/1–2)
  - m1: พัฒนาการของประวัติศาสตร์ไทย — Development of Thai History (ส4.1 ม.1/1–2)
  - m2: ประวัติศาสตร์โลกยุคโบราณ — Ancient World History (ส4.1 ม.2/1–2)
  - m3: ประวัติศาสตร์เอเชียตะวันออกเฉียงใต้ — Southeast Asian History (ส4.1 ม.3/1–2)
  - m4: ประวัติศาสตร์ไทยร่วมสมัย — Contemporary Thai History (ส4.1 ม.4/1–2)
  - m5: ประวัติศาสตร์โลกยุคใหม่ — Modern World History (ส4.1 ม.5/1–2)
  - m6: การวิเคราะห์หลักฐานทางประวัติศาสตร์ — Analyzing Historical Evidence (ส4.2 ม.6/1–2)

- [ ] **Step 6: Create `src/data/curriculum/Geography.js`** — topics + indicators per grade (subject value `'Geography'`):
  - p1: สิ่งแวดล้อมรอบตัว — Environment Around Us (ส5.1 ป.1/1–2)
  - p2: แผนผังและทิศทาง — Maps and Directions (ส5.1 ป.2/1–2)
  - p3: ลมฟ้าอากาศ — Weather (ส5.2 ป.3/1–2)
  - p4: แผนที่และมาตราส่วน — Maps and Scale (ส5.1 ป.4/1–2)
  - p5: ภูมิศาสตร์กายภาพของไทย — Physical Geography of Thailand (ส5.1 ป.5/1–2)
  - p6: ประชากรและชุมชน — Population and Communities (ส5.1 ป.6/1–2)
  - m1: เครื่องมือทางภูมิศาสตร์ — Geographic Tools (ส5.1 ม.1/1–2)
  - m2: ธรณีสัณฐาน — Landforms (ส5.1 ม.2/1–2)
  - m3: ภูมิอากาศและปรากฏการณ์ทางธรรมชาติ — Climate and Natural Phenomena (ส5.2 ม.3/1–2)
  - m4: ภูมิศาสตร์ภูมิภาค — Regional Geography (ส5.1 ม.4/1–2)
  - m5: ทรัพยากรธรรมชาติและการจัดการ — Natural Resources and Management (ส5.2 ม.5/1–2)
  - m6: แผนที่เทคโนโลยีและ GIS — Mapping Technology and GIS (ส5.1 ม.6/1–2)

- [ ] **Step 7: Create `src/data/curriculum/Computing.js`** — topics + indicators per grade (subject value `'Computing'`):
  - p1: การใช้คอมพิวเตอร์เบื้องต้น — Basic Computer Use (ว4.1 ป.1/1–2)
  - p2: การวาดและระบายสีด้วยโปรแกรม — Drawing and Coloring with Software (ว4.1 ป.2/1–2)
  - p3: การพิมพ์และการจัดรูปแบบ — Typing and Formatting (ว4.1 ป.3/1–2)
  - p4: การใช้อินเทอร์เน็ตอย่างปลอดภัย — Safe Internet Use (ว4.1 ป.4/1–2)
  - p5: การสร้างงานนำเสนอ — Creating Presentations (ว4.1 ป.5/1–2)
  - p6: การเขียนโปรแกรมเบื้องต้น — Introduction to Programming (ว4.1 ป.6/1–2)
  - m1: การคิดเชิงคำนวณ — Computational Thinking (ว4.2 ม.1/1–2)
  - m2: โครงสร้างข้อมูลเบื้องต้น — Basic Data Structures (ว4.2 ม.2/1–2)
  - m3: การออกแบบอัลกอริทึม — Algorithm Design (ว4.2 ม.3/1–2)
  - m4: วิทยาการข้อมูลเบื้องต้น — Introduction to Data Science (ว4.2 ม.4/1–2)
  - m5: การพัฒนาเว็บและแอปพลิเคชัน — Web and App Development (ว4.2 ม.5/1–2)
  - m6: ปัญญาประดิษฐ์เบื้องต้น — Introduction to Artificial Intelligence (ว4.2 ม.6/1–2)

- [ ] **Step 8: Update `src/data/curriculum/index.js`** to import and spread all seven arrays (order after the existing three).

- [ ] **Step 9: Raise the verify threshold to `>= 132`** in `scripts/verify-curriculum.mjs` and run:

Run: `node scripts/verify-curriculum.mjs`
Expected: PASS (132 templates — the `Other` file arrives in Task 9 and pushes it to 144)

- [ ] **Step 10: Commit**

```bash
git add src/data/curriculum/SocialStudies.js src/data/curriculum/Physics.js src/data/curriculum/Chemistry.js src/data/curriculum/Biology.js src/data/curriculum/History.js src/data/curriculum/Geography.js src/data/curriculum/Computing.js src/data/curriculum/index.js scripts/verify-curriculum.mjs
git commit -m "feat(curriculum): add remaining 7 subject template files (144 total)"
```

---

### Task 9: Content — Other subject file + final verification

**Files:**
- Create: `src/data/curriculum/Other.js`
- Modify: `src/data/curriculum/index.js`

**Interfaces:**
- Consumes: template shape from Task 1.
- Produces: `export const OTHER` (12 entries) completing the 12th subject. Note: the app's `Other` subject is for "Other" — a catch-all. Use cross-curricular topics (ชีวิตประจำวัน, ทักษะชีวิต) so it is curriculum-plausible.

- [ ] **Step 1: Create `src/data/curriculum/Other.js`** — topics (th/en) + indicators per grade. Since "Other" has no dedicated MOE strand, reference life-skill / activity strands:
  - p1: การดูแลตนเองและสุขอนามัย — Self-Care and Hygiene (ส1.1 ป.1/1, ว1.1 ป.1/1)
  - p2: ความปลอดภัยในชีวิตประจำวัน — Daily Safety (ส2.1 ป.2/1)
  - p3: การทำงานร่วมกันเป็นกลุ่ม — Working Together in Groups (ส2.1 ป.3/1)
  - p4: การจัดการเวลาและหน้าที่ — Time Management and Responsibilities (ส3.1 ป.4/1)
  - p5: การแก้ปัญหาอย่างสร้างสรรค์ — Creative Problem Solving (ว4.1 ป.5/1)
  - p6: การเตรียมตัวเข้าสู่วัยรุ่น — Preparing for Adolescence (ส1.1 ป.6/1)
  - m1: ทักษะชีวิตในโรงเรียน — Life Skills at School (ส1.1 ม.1/1)
  - m2: การเงินส่วนบุคคล — Personal Finance (ส3.1 ม.2/1)
  - m3: การเป็นพลเมืองที่ดี — Being a Good Citizen (ส2.1 ม.3/1)
  - m4: จิตอาสาและการบริการสังคม — Volunteering and Community Service (ส1.1 ม.4/1)
  - m5: การเตรียมตัวสู่อาชีพ — Career Readiness (ส3.1 ม.5/1)
  - m6: การจัดการตนเองและความสุข — Self-Management and Well-being (ส1.1 ม.6/1)

- [ ] **Step 2: Update `src/data/curriculum/index.js`** to import `OTHER` and spread it last.

- [ ] **Step 3: Run full verification** — raise the threshold to `>= 144` in `scripts/verify-curriculum.mjs` (currently `>= 132` from Task 8), then run:

Run: `node scripts/verify-curriculum.mjs`
Expected: PASS (144 templates)

- [ ] **Step 4: Build:**

Run: `npm run build`
Expected: build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/data/curriculum/Other.js src/data/curriculum/index.js
git commit -m "feat(curriculum): add Other subject templates, 144 total"
```

---

### Task 10: Final end-to-end verification

**Files:**
- No new files. Manual verification only.

**Interfaces:**
- Consumes: all prior tasks.

- [ ] **Step 1: Run all static checks:**

Run: `node scripts/verify-level-subject.mjs && node scripts/verify-curriculum.mjs && npm run build`
Expected: all PASS / build succeeds

- [ ] **Step 2: Manual checklist** (browser, `npm run dev` then visit `/#/library`):
  - [ ] Tab switcher shows "เนื้อหาของฉัน" / "เทมเพลตหลักสูตร สพฐ." and both render.
  - [ ] Template tab shows the disclaimer line.
  - [ ] Template filters: search by topic/indicator; subject dropdown; grade dropdown — all filter correctly.
  - [ ] Cards show badge, bilingual topic (current lang), `level · subject`, indicator chips.
  - [ ] Switch EN ↔ ไทย — card topics and chrome translate; open a template → slide text switches language live.
  - [ ] Open a template → ContentView shows "บันทึกเข้า Library"; click → toast + new copy in "My materials".
  - [ ] Open the saved copy → "บันทึกแล้ว" badge; edit/delete works; delete → template still in template tab.
  - [ ] User-created (single-language) items still render correctly (backward compatibility).
  - [ ] All 12 subjects × 12 grades present (grid scroll through / search each subject).

- [ ] **Step 3: Commit any manual-fix changes** (if the checklist surfaced bugs, fix and commit them):

```bash
git add -A
git commit -m "fix(curriculum): address verification findings"
```

- [ ] **Step 4: Update the design doc's verification section** if the manual run revealed plan gaps. Otherwise leave as-is.