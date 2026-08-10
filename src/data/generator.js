/* ==========================================================================
   KruMate OS — Generator
   Turns a teacher's prompt into structured mock teaching content.
   Deterministic: same prompt → same output. Swap-friendly via api.js.
   ========================================================================== */
import { getLang } from '../services/i18n.js';
import { fmtId } from '../utils/format.js';
import { levelLabel } from './types.js';

// ---------- Prompt parsing ----------
function parsePrompt(prompt) {
  const p = prompt.trim();
  let grade = 'Grade 6';
  const gradeMatch = p.match(/\b(?:grade|class)\s*(\d+)\b/i) || p.match(/ชั้น\s*ป\.?\s*(\d+)/i) || p.match(/ชั้น\s*(\d+)/i);
  const gradeNum = gradeMatch ? Number(gradeMatch[1]) : null;
  grade = gradeNum != null && (getLang() === 'th' ? 'ชั้น ป.' + gradeNum : 'Grade ' + gradeNum);
  let count = 10;
  const countMatch = p.match(/(\d+)\s*(?:questions?|ข้อ|คำถาม)/i);
  if (countMatch) count = Math.min(30, Math.max(5, Number(countMatch[1])));
  return { grade, count };
}

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function shuffle(arr, seed) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    const j = seed % (i + 1);
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

function extractTopic(prompt) {
  const parts = prompt.trim().split(/\s*(?:about|on|of)\s+|เรื่อง|เกี่ยวกับ/);
  const last = parts[parts.length - 1].trim();
  return last || prompt.trim();
}

// ---------- Lesson Plan ----------
function buildLesson(prompt, parsed, opts = {}) {
  const topic = extractTopic(prompt);
  const subject = opts.subject || guessSubject(prompt);
  return {
    type: 'lesson',
    title: 'Lesson Plan: ' + topic,
    grade: parsed.grade,
    subject: subject,
    category: 'Lesson Plan',
    objectives: [
      'Explain the key ideas of "' + topic + '" in their own words',
      'Apply "' + topic + '" concepts to solve practice problems',
      'Observe and record examples of "' + topic + '" in everyday life'
    ],
    materials: [
      'Whiteboard / smart TV for examples',
      'Student worksheet (printed)',
      'Everyday objects related to ' + topic,
      'Exit-ticket slips'
    ],
    procedure: [
      { phase: 'Warm-up', time: '5 min', detail: 'Ask students what they already know about ' + topic + '. Record ideas on the board.' },
      { phase: 'Introduce', time: '10 min', detail: 'Present the core concept with 2–3 clear examples related to ' + topic + '.' },
      { phase: 'Guided practice', time: '15 min', detail: 'Work through example questions together as a class.' },
      { phase: 'Independent practice', time: '15 min', detail: 'Students complete the worksheet on their own or in pairs.' },
      { phase: 'Wrap-up', time: '10 min', detail: 'Review key points, collect exit tickets, and preview the next lesson.' }
    ],
    assessment: [
      'Formative: observe participation during guided practice',
      'Exit ticket: 2 quick questions on ' + topic,
      'Worksheet completion and accuracy'
    ],
    prompt: prompt
  };
}

// ---------- Worksheet ----------
function buildWorksheet(prompt, parsed, opts = {}) {
  const topic = extractTopic(prompt);
  return {
    type: 'worksheet',
    title: 'Worksheet: ' + topic,
    grade: parsed.grade,
    subject: opts.subject || guessSubject(prompt),
    category: 'Worksheet',
    instructions: 'Read each part carefully. Answer in complete sentences where directed. Work neatly and ask your teacher if you get stuck.',
    sections: [
      {
        heading: 'Part A — Recall',
        tasks: [
          'Write one sentence that defines ' + topic + ' in your own words.',
          'List 3 real-life examples of ' + topic + '.',
          'True or False: ' + topic + ' only matters at school. Explain why.'
        ]
      },
      {
        heading: 'Part B — Practice',
        tasks: [
          'Draw a simple diagram that represents ' + topic + ' and label its main parts.',
          'Create 2 of your own example problems about ' + topic + ' and solve them.',
          'Match each keyword below to its correct meaning.'
        ]
      },
      {
        heading: 'Part C — Think deeper',
        tasks: [
          'Write a short paragraph explaining why ' + topic + ' matters in daily life.',
          'Challenge: how would you teach ' + topic + ' to a younger student?'
        ]
      }
    ],
    prompt: prompt
  };
}

// ---------- Quiz ----------
function normalizeKinds(prefs, n) {
  if (!prefs || !prefs.length) return new Array(n).fill('mc');
  const list = [];
  for (let i = 0; i < n; i++) list.push(prefs[i % prefs.length]);
  return list;
}

function buildQuiz(prompt, parsed, opts = {}, prefs) {
  const topic = extractTopic(prompt);
  const count = parsed.count;
  const seeds = hash(prompt);
  const kinds = normalizeKinds(prefs, count);
  const questions = [];
  const corrects = shuffle(['A', 'B', 'C', 'D'], seeds);
  const mcOptions = [
    ['All organisms and the environment they live in', 'Only animals in the wild', 'Only plants in a garden', 'The weather each day'],
    ['The parts and how they work together', 'Only the biggest part', 'Only the smallest part', 'Just the name of the topic'],
    ['By reading about it once', 'Through observation, questions, and evidence', 'By guessing', 'By memorising the title'],
    ['To show relationships between ideas clearly', 'To make it longer', 'To hide the main point', 'To confuse readers']
  ];
  for (let i = 0; i < count; i++) {
    const kind = kinds[i];
    if (kind === 'mc') {
      const opts = mcOptions[(hash(topic) + i) % mcOptions.length];
      const answer = corrects[i % corrects.length];
      questions.push({
        kind: 'mc',
        question: (i % 3 === 0)
          ? 'Which of these best describes ' + topic + '?'
          : 'Why is it useful to understand ' + topic + '?',
        options: opts,
        answerLetter: answer,
        answer: answer + ') ' + opts[0]
      });
    } else if (kind === 'tf') {
      const isTrue = seedIsTrue(prompt, i);
      questions.push({
        kind: 'tf',
        question: 'True or False: ' + topic + ' ' + (isTrue ? 'is an important idea to study in class.' : 'has nothing to do with our everyday lives.'),
        answer: isTrue ? 'True' : 'False',
        isTrue: isTrue
      });
    } else {
      questions.push({
        kind: 'sa',
        question: 'Explain in 2–3 sentences: what did you learn about ' + topic + '?',
        answer: 'Model answer: any clear description of the key ideas of ' + topic + '.'
      });
    }
  }
  return {
    type: 'quiz',
    title: 'Quiz: ' + topic + ' (' + count + ' questions)',
    grade: parsed.grade,
    subject: opts.subject || guessSubject(prompt),
    category: 'Quiz',
    count: count,
    questions: questions,
    prompt: prompt
  };
}

function seedIsTrue(prompt, i) {
  return (hash(prompt) + i) % 2 === 0 && (hash(prompt) + i) % 5 !== 0;
}

// ---------- Slides ----------
function buildSlides(prompt, parsed, opts = {}) {
  const topic = extractTopic(prompt);
  return {
    type: 'slides',
    title: 'Slides: ' + topic,
    grade: parsed.grade,
    subject: opts.subject || guessSubject(prompt),
    category: 'Slides',
    outline: [
      'Title slide', 'Warm-up question', 'Learning goals',
      'Key idea 1', 'Key idea 2', 'Example', 'Guided practice', 'Summary & exit ticket'
    ],
    slides: [
      { title: topic, subtitle: parsed.grade + ' · ' + (opts.subject || guessSubject(prompt)), bullets: [] },
      { title: 'Warm-up question', bullets: ['What do you already know about ' + topic + '?', 'Turn and talk with a partner for 2 minutes.'] },
      { title: 'Learning goals', bullets: [
        'I can explain the main ideas of ' + topic,
        'I can use examples to show my understanding',
        'I can answer review questions correctly'
      ] },
      { title: 'Key idea 1', bullets: ['A clear definition of ' + topic, 'The most important features', 'Why it matters in daily life'] },
      { title: 'Key idea 2', bullets: ['Related concepts and vocabulary', 'Common examples', 'How ideas connect to each other'] },
      { title: 'Example', bullets: ['Worked example shown step by step', 'Discuss each step with the class'] },
      { title: 'Guided practice', bullets: ['Complete exercises 1–3 together', 'Check answers as a class'] },
      { title: 'Summary & exit ticket', bullets: ['Three key things we learned today', 'Exit ticket: 2 quick questions'] }
    ],
    prompt: prompt
  };
}

// ---------- Rubric ----------
function buildRubric(prompt, parsed, opts = {}) {
  const topic = extractTopic(prompt);
  const criteria = [
    { name: 'Understanding', rows: ['Deep understanding shown with examples', 'Solid understanding of key ideas', 'Partial understanding', 'Little understanding shown'] },
    { name: 'Accuracy', rows: ['No errors, work is correct', 'A few minor errors', 'Several errors', 'Mostly incorrect'] },
    { name: 'Presentation', rows: ['Neat, organised, easy to read', 'Mostly neat and organised', 'Somewhat messy', 'Hard to follow'] },
    { name: 'Effort & participation', rows: ['Consistently engaged and thorough', 'Good effort throughout', 'Some effort shown', 'Little effort shown'] }
  ];
  return {
    type: 'rubric',
    title: 'Rubric: ' + topic,
    grade: parsed.grade,
    subject: opts.subject || guessSubject(prompt),
    category: 'Rubric',
    scale: ['Exceeds (4)', 'Meets (3)', 'Developing (2)', 'Beginning (1)'],
    criteria: criteria,
    prompt: prompt
  };
}

// ---------- Classroom Activity ----------
function buildActivity(prompt, parsed, opts = {}) {
  const topic = extractTopic(prompt);
  return {
    type: 'activity',
    title: 'Activity: ' + topic,
    grade: parsed.grade,
    subject: opts.subject || guessSubject(prompt),
    category: 'Activity',
    summary: 'A hands-on, student-centred activity to explore ' + topic + '.',
    objective: 'Students will be able to demonstrate and explain the key ideas of ' + topic + ' through guided hands-on work.',
    time: '35 minutes',
    groupSize: 'Pairs or groups of 3–4',
    materials: [
      'Printed task cards (one per group)',
      'Worksheet and pencils',
      'Everyday objects or images related to ' + topic,
      'Whiteboard for sharing results'
    ],
    steps: [
      { time: '5 min', detail: 'Introduce the activity and show a quick example. Check instructions with the class.' },
      { time: '15 min', detail: 'Groups work on the task cards about ' + topic + '. Teacher circulates and prompts with questions.' },
      { time: '10 min', detail: 'Each group shares one interesting finding with the class.' },
      { time: '5 min', detail: 'Wrap up: connect findings back to the core concept and collect completed worksheets.' }
    ],
    discussion: [
      'What surprised you about ' + topic + '?',
      'Where do we see ' + topic + ' in everyday life?',
      'What was the hardest part of the task?'
    ],
    prompt: prompt
  };
}

// ---------- Subject sniffing ----------
const SUBJECTS = {
  science: 'Science', วิทยาศาสตร์: 'Science', biology: 'Science', ฟิสิกส์: 'Science',
  chemistry: 'Science', เคมี: 'Science', physics: 'Science',
  math: 'Mathematics', maths: 'Mathematics', คณิต: 'Mathematics', คณิตศาสตร์: 'Mathematics',
  english: 'English', ภาษาอังกฤษ: 'English', ภาษาไทย: 'Thai Language', thai: 'Thai Language',
  สังคม: 'Social Studies', social: 'Social Studies', ประวัติศาสตร์: 'Social Studies'
};

function guessSubject(prompt) {
  const p = prompt.toLowerCase();
  for (const k in SUBJECTS) {
    if (p.includes(k.toLowerCase())) return SUBJECTS[k];
  }
  return 'General';
}

// ---------- Public API ----------
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