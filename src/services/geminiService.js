/* ==========================================================================
   KruMate OS — Gemini AI Service
   ติดต่อ Gemini API จริง ๆ เพื่อสร้างสื่อการสอน
   API key อยู่ใน .env (VITE_GEMINI_API_KEY) — ไม่ถูก expose ตอน deploy
   ========================================================================== */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-3.5-flash-lite';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// ส่ง prompt ไปหา Gemini และรับ text กลับมา
async function callGemini(prompt) {
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return text;
}

// แปลง text ที่ได้จาก Gemini (JSON string) ให้เป็น object
function parseJSON(text) {
  // Gemini บางครั้งส่ง ```json ... ``` มาด้วย — ต้องตัดออกก่อน
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  return JSON.parse(cleaned);
}

// ============================================================
//  BUILD PROMPTS — สร้าง prompt ที่ส่งให้ Gemini แต่ละประเภท
// ============================================================

function lessonPrompt({ prompt, level, subject, lang }) {
  const langInstruction = lang === 'th'
    ? 'ตอบเป็นภาษาไทยทั้งหมด'
    : 'Reply entirely in English';
  return `${langInstruction}. You are an expert Thai school teacher.
Create a detailed lesson plan JSON for: "${prompt}"
Grade level: ${level}. Subject: ${subject}.

Return ONLY valid JSON (no markdown) in this exact structure:
{
  "title": "Lesson Plan: [topic]",
  "grade": "${level}",
  "subject": "${subject}",
  "objectives": ["objective 1", "objective 2", "objective 3"],
  "materials": ["material 1", "material 2", "material 3", "material 4"],
  "procedure": [
    { "phase": "Warm-up", "time": "5 min", "detail": "..." },
    { "phase": "Introduce", "time": "10 min", "detail": "..." },
    { "phase": "Guided practice", "time": "15 min", "detail": "..." },
    { "phase": "Independent practice", "time": "15 min", "detail": "..." },
    { "phase": "Wrap-up", "time": "10 min", "detail": "..." }
  ],
  "assessment": ["assessment 1", "assessment 2", "assessment 3"]
}`;
}

function worksheetPrompt({ prompt, level, subject, lang }) {
  const langInstruction = lang === 'th'
    ? 'ตอบเป็นภาษาไทยทั้งหมด'
    : 'Reply entirely in English';
  return `${langInstruction}. You are an expert Thai school teacher.
Create a printable worksheet JSON for: "${prompt}"
Grade level: ${level}. Subject: ${subject}.

Return ONLY valid JSON in this exact structure:
{
  "title": "Worksheet: [topic]",
  "grade": "${level}",
  "subject": "${subject}",
  "instructions": "Read each part carefully...",
  "sections": [
    {
      "heading": "Part A — Recall",
      "tasks": ["task 1", "task 2", "task 3"]
    },
    {
      "heading": "Part B — Practice",
      "tasks": ["task 1", "task 2", "task 3"]
    },
    {
      "heading": "Part C — Think deeper",
      "tasks": ["task 1", "task 2"]
    }
  ]
}`;
}

function quizPrompt({ prompt, level, subject, count, kinds, lang }) {
  const langInstruction = lang === 'th'
    ? 'ตอบเป็นภาษาไทยทั้งหมด'
    : 'Reply entirely in English';
  const kindList = kinds.join(', ');
  return `${langInstruction}. You are an expert Thai school teacher.
Create a quiz JSON for: "${prompt}"
Grade level: ${level}. Subject: ${subject}.
Generate exactly ${count} questions using these types: ${kindList}.
mc = multiple choice (4 options A B C D), tf = true/false, sa = short answer.

IMPORTANT — Math formatting rules (MUST follow):
- Do NOT use LaTeX notation. Never use $...$ or $$...$$ or \\(...\\).
- Write math in plain text only: use × for multiply, ÷ for divide, ^ for power (e.g. 2^4 not $2^4$), √ for square root.
- Example good: "2^4 = 16" | Example bad: "$2^4 = 16$"

Return ONLY valid JSON:
{
  "title": "Quiz: [topic] (${count} questions)",
  "grade": "${level}",
  "subject": "${subject}",
  "count": ${count},
  "questions": [
    {
      "kind": "mc",
      "question": "...",
      "options": ["option A", "option B", "option C", "option D"],
      "answerLetter": "A",
      "answer": "A) option A"
    },
    {
      "kind": "tf",
      "question": "True or False: ...",
      "answer": "True",
      "isTrue": true
    },
    {
      "kind": "sa",
      "question": "Explain...",
      "answer": "Model answer: ..."
    }
  ]
}`;
}

function slidesPrompt({ prompt, level, subject, lang }) {
  const langInstruction = lang === 'th'
    ? 'ตอบเป็นภาษาไทยทั้งหมด'
    : 'Reply entirely in English';
  return `${langInstruction}. You are an expert Thai school teacher.
Create presentation slides JSON for: "${prompt}"
Grade level: ${level}. Subject: ${subject}.

Return ONLY valid JSON:
{
  "title": "Slides: [topic]",
  "grade": "${level}",
  "subject": "${subject}",
  "outline": ["Title slide", "Warm-up question", "Learning goals", "Key idea 1", "Key idea 2", "Example", "Guided practice", "Summary & exit ticket"],
  "slides": [
    { "title": "[topic]", "subtitle": "${level} · ${subject}", "bullets": [] },
    { "title": "Warm-up question", "bullets": ["question 1", "instruction"] },
    { "title": "Learning goals", "bullets": ["goal 1", "goal 2", "goal 3"] },
    { "title": "Key idea 1", "bullets": ["point 1", "point 2", "point 3"] },
    { "title": "Key idea 2", "bullets": ["point 1", "point 2", "point 3"] },
    { "title": "Example", "bullets": ["example step 1", "example step 2"] },
    { "title": "Guided practice", "bullets": ["activity 1", "activity 2"] },
    { "title": "Summary & exit ticket", "bullets": ["key point 1", "key point 2", "exit ticket question"] }
  ]
}`;
}

function rubricPrompt({ prompt, level, subject, lang }) {
  const langInstruction = lang === 'th'
    ? 'ตอบเป็นภาษาไทยทั้งหมด'
    : 'Reply entirely in English';
  return `${langInstruction}. You are an expert Thai school teacher.
Create a grading rubric JSON for: "${prompt}"
Grade level: ${level}. Subject: ${subject}.

IMPORTANT: Do NOT use LaTeX. Write math in plain text only.

Return ONLY valid JSON:
{
  "title": "Rubric: [topic]",
  "grade": "${level}",
  "subject": "${subject}",
  "scale": ["Exceeds (4)", "Meets (3)", "Developing (2)", "Beginning (1)"],
  "criteria": [
    {
      "name": "Understanding",
      "rows": ["Deep understanding with examples", "Solid understanding", "Partial understanding", "Little understanding"]
    },
    {
      "name": "Accuracy",
      "rows": ["No errors", "Minor errors", "Several errors", "Mostly incorrect"]
    },
    {
      "name": "Presentation",
      "rows": ["Neat and organised", "Mostly neat", "Somewhat messy", "Hard to follow"]
    },
    {
      "name": "Effort",
      "rows": ["Consistently thorough", "Good effort", "Some effort", "Little effort"]
    }
  ]
}`;
}

function activityPrompt({ prompt, level, subject, lang }) {
  const langInstruction = lang === 'th'
    ? 'ตอบเป็นภาษาไทยทั้งหมด'
    : 'Reply entirely in English';
  return `${langInstruction}. You are an expert Thai school teacher.
Create a classroom activity JSON for: "${prompt}"
Grade level: ${level}. Subject: ${subject}.

IMPORTANT: Do NOT use LaTeX. Write math in plain text only.

Return ONLY valid JSON:
{
  "title": "Activity: [topic]",
  "grade": "${level}",
  "subject": "${subject}",
  "summary": "Brief description of the activity",
  "objective": "Students will be able to...",
  "time": "35 minutes",
  "groupSize": "Pairs or groups of 3-4",
  "materials": ["material 1", "material 2", "material 3"],
  "steps": [
    { "time": "5 min", "detail": "Introduction step" },
    { "time": "15 min", "detail": "Main activity step" },
    { "time": "10 min", "detail": "Sharing step" },
    { "time": "5 min", "detail": "Wrap-up step" }
  ],
  "discussion": [
    "Discussion question 1?",
    "Discussion question 2?",
    "Discussion question 3?"
  ]
}`;
}


function assistantPrompt({ message, lang }) {
  const langInstruction = lang === 'th'
    ? 'ตอบเป็นภาษาไทย เป็นกันเอง เหมือนเพื่อนครูที่ช่วยกัน'
    : 'Reply in English, friendly and professional like a teaching colleague';
  return `${langInstruction}. You are KruMate, an AI teaching assistant for Thai teachers.
Help with this teaching question: "${message}"
Give practical, classroom-ready advice. Keep it concise (3-5 sentences or bullet points).`;
}

function suggestionsPrompt({ lang }) {
  const langInstruction = lang === 'th' ? 'ตอบเป็นภาษาไทย' : 'Reply in English';
  return `${langInstruction}. You are KruMate AI for Thai teachers.
Generate 5 creative teaching prompt suggestions for Thai school teachers.
Return ONLY valid JSON array:
[
  { "title": "short topic name", "prompt": "full teaching prompt..." },
  ...
]`;
}

// ============================================================
//  PUBLIC EXPORTS — ฟังก์ชันที่ api.js จะเรียกใช้
// ============================================================

export async function geminiGenerate({ prompt, type, quizOpts, level, subject, lang }) {
  let systemPrompt;
  const opts = { prompt, level, subject, lang };

  if (type === 'lesson') {
    systemPrompt = lessonPrompt(opts);
  } else if (type === 'worksheet') {
    systemPrompt = worksheetPrompt(opts);
  } else if (type === 'quiz') {
    systemPrompt = quizPrompt({
      ...opts,
      count: quizOpts?.count || 10,
      kinds: quizOpts?.kinds?.length ? quizOpts.kinds : ['mc', 'tf', 'sa'],
    });
  } else if (type === 'slides') {
    systemPrompt = slidesPrompt(opts);
  } else if (type === 'rubric') {
    systemPrompt = rubricPrompt(opts);
  } else if (type === 'activity') {
    systemPrompt = activityPrompt(opts);
  } else {
    throw new Error('Unknown type: ' + type);
  }


  const text = await callGemini(systemPrompt);
  const parsed = parseJSON(text);

  // เพิ่ม field ที่ app ต้องการ
  return {
    ...parsed,
    type,
    category: parsed.title?.split(':')[0] || type,
    prompt,
  };
}

export async function geminiSuggestions(lang) {
  const text = await callGemini(suggestionsPrompt({ lang }));
  return parseJSON(text);
}

export async function geminiAssistant(message, lang) {
  const text = await callGemini(assistantPrompt({ message, lang }));
  return text;
}

// ตรวจสอบว่า API key ถูกตั้งค่าแล้วหรือยัง
export function isGeminiConfigured() {
  return Boolean(GEMINI_API_KEY && GEMINI_API_KEY !== 'your_api_key_here');
}
