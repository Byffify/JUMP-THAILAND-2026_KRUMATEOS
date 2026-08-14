import { assetFor } from './types.js';

export const GUIDE_CATS = [
  { id: 'getting-started',   icon: 'assets/plan_for_teacher.png',  key: 'support.cat.gettingStarted' },
  { id: 'content-types',     icon: 'assets/Class Activity.png',    key: 'support.cat.contentTypes' },
  { id: 'library-export',    icon: 'assets/Worksheet.png',         key: 'support.cat.libraryExport' },
  { id: 'assistant-template', icon: 'assets/assistant.svg',        key: 'support.cat.assistantTemplate' },
];

export const FAQ_CATS = [
  { id: 'generating', icon: 'assets/lesson-plan.svg', key: 'support.cat.faqGenerating' },
  { id: 'technical',  icon: 'assets/quiz.svg',        key: 'support.cat.faqTechnical' },
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
  icon: 'assets/Worksheet.png',
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
  icon: 'assets/Worksheet.png',
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
  icon: 'assets/Assessment.png',
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
  icon: 'assets/Assessment.png',
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
  icon: 'assets/assistant.svg',
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
  icon: 'assets/assistant.svg',
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
  icon: 'assets/lesson-plan.svg',
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
  icon: 'assets/lesson-plan.svg',
  title: 'สร้างจากเทมเพลต',
  summary: 'กรอกฟอร์มแทนการพิมพ์คำสั่งอิสระ',
  steps: [
    { title: 'สลับไปโหมดเทมเพลต', text: 'บนเครื่องมือสร้าง คลิก "ใช้เทมเพลต"' },
    { title: 'กรอกข้อมูล', text: 'กรอกหัวข้อ ระยะเวลา จุดประสงค์ และหมายเหตุ — คำสั่งถูกสร้างให้อัตโนมัติ' },
    { title: 'ปรับแก้และสร้าง', text: 'แก้ไขคำสั่งเพิ่มเติมได้ แล้วคลิก "สร้างเลย"' },
  ],
});

// ---------- FAQ — content ----------
function faq(id, category, enQ, enA, thQ, thA) {
  FAQ.en.push({ id, category, question: enQ, answer: enA });
  FAQ.th.push({ id, category, question: thQ, answer: thA });
}

faq(
  'gen-fail',
  'generating',
  'Why did my generation fail?',
  'Generation can fail when the prompt is empty, the AI service is unavailable, or the request times out. Make sure you wrote a prompt, then click Generate again. A mock result appears automatically when the AI service is not available, so demos never break.',
  'ทำไมการสร้างของฉันล้มเหลว',
  'การสร้างอาจล้มเหลวเมื่อคำสั่งว่างเปล่า บริการ AI ใช้งานไม่ได้ หรือหมดเวลา กรุณาเขียนคำสั่งแล้วคลิกสร้างอีกครั้ง ผลลัพธ์ตัวอย่างจะแสดงอัตโนมัติเมื่อบริการ AI ไม่พร้อมใช้งาน เพื่อให้การเดโมไม่สะดุด'
);

faq(
  'quiz-limits',
  'generating',
  'What quiz settings are available?',
  'You can choose the number of questions (5 to 30) and the question types: multiple choice, true/false, and short answer. You must select at least one question type.',
  'มีการตั้งค่าแบบทดสอบอะไรบ้าง',
  'คุณเลือกจำนวนข้อได้ (5–30 ข้อ) และประเภทคำถาม: ปรนัย ถูก/ผิด และข้อเขียนสั้น ต้องเลือกอย่างน้อยหนึ่งประเภท'
);

faq(
  'prompt-empty',
  'generating',
  'Why won\'t it generate an empty prompt?',
  'A prompt is required so the AI knows what to create. Try describing the topic, grade level and subject, like "Grade 6 science lesson about ecosystems".',
  'ทำไมพิมพ์คำสั่งว่างแล้วสร้างไม่ได้',
  'ต้องมีคำสั่งเพื่อให้ AI รู้ว่าต้องการสร้างอะไร ลองอธิบายหัวข้อ ระดับชั้น และวิชา เช่น "บทเรียนวิทยาศาสตร์ ป.6 เรื่องระบบนิเวศ"'
);

faq(
  'api-key',
  'technical',
  'Do I need a Gemini API key to use KruMate?',
  'No. The app works with mock data by default. To use real AI generation, the serverless proxy needs a GEMINI_API_KEY environment variable set on the server — the key is never exposed to the browser.',
  'ต้องใช้ Gemini API Key เพื่อใช้ KruMate ใช่ไหม',
  'ไม่จำเป็น แอปทำงานด้วยข้อมูลตัวอย่างโดยค่าเริ่มต้น หากต้องการใช้ AI จริง ต้องตั้งตัวแปร GEMINI_API_KEY บนเซิร์ฟเวอร์ผ่าน serverless proxy — คีย์ไม่ถูกส่งออกไปยังเบราว์เซอร์'
);

faq(
  'data-storage',
  'technical',
  'Where are my materials stored?',
  'Everything is stored in your browser (local storage). Materials you have saved appear in the Library; unsaved content lives in a temporary store for the current session.',
  'สื่อของฉันถูกเก็บไว้ที่ไหน',
  'ข้อมูลทั้งหมดถูกเก็บในเบราว์เซอร์ของคุณ (local storage) สื่อที่บันทึกแล้วจะอยู่ในคลัง ส่วนเนื้อหาที่ยังไม่บันทึกจะอยู่ในหน่วยความจำชั่วคราวของเซสชันนี้'
);

faq(
  'export-image',
  'technical',
  'How do I save a material as an image?',
  'Open the material, then click "Save as Image" in the action bar. The content is rendered into a PNG you can download and share.',
  'จะบันทึกสื่อเป็นรูปภาพได้อย่างไร',
  'เปิดสื่อ แล้วคลิก "บันทึกเป็นรูปภาพ" ในแถบเครื่องมือ เนื้อหาจะถูกแปลงเป็นไฟล์ PNG ให้ดาวน์โหลดและแชร์ได้'
);

// ---------- Helpers ----------
export function getGuide(lang) { return GUIDE[lang] || GUIDE.en; }
export function getFaq(lang) { return FAQ[lang] || FAQ.en; }
export function getGuideById(lang, id) {
  return (getGuide(lang) || []).find(g => g.id === id);
}
export default { GUIDE_CATS, FAQ_CATS, GUIDE, FAQ, getGuide, getFaq, getGuideById };