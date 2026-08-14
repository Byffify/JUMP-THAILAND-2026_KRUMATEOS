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

const GUIDE = { en: [], th: [] };
const FAQ = { en: [], th: [] };

// ---------- Teacher's Guide — content ----------
GUIDE.en.push({
  id: 'create-material',
  category: 'content-types',
  icon: 'assets/Class Activity.png',
  title: 'Create teaching materials',
  summary: 'Every output type — lesson plan, worksheet, quiz, slides, rubric, classroom activity — is created the same way. Pick a type, write one prompt, and generate.',
  steps: [
    { title: 'Open the generator', text: 'Click "Generator" in the top nav, or use Quick Create on the dashboard.', screenshot: { src: 'support/create-activity-1.png', alt: 'Generator page' } },
    { title: 'Pick the output type', text: 'Choose one of the six types: Lesson Plan, Worksheet, Quiz, Slides, Rubric, or Classroom Activity.' },
    { title: 'Set level and subject', text: 'Optionally choose the study level and subject so the material matches your class.' },
    { title: 'Write your prompt', text: 'Describe what you need — in free mode type any prompt, or in template mode fill in the topic form and the prompt builds itself.' },
    { title: 'Generate and apply', text: 'Click "Generate". Review the result on the preview page, then save it to your library, print it, or export it as an image.' },
  ],
});
GUIDE.th.push({
  id: 'create-material',
  category: 'content-types',
  icon: 'assets/Class Activity.png',
  title: 'สร้างสื่อการสอน',
  summary: 'ผลงานทุกประเภท — แผนการสอน ใบงาน แบบทดสอบ สไลด์ เกณฑ์การประเมิน กิจกรรมในชั้นเรียน — สร้างด้วยวิธีเดียวกัน เลือกประเภท เขียนคำสั่งหนึ่งบรรทัด แล้วสร้าง',
  steps: [
    { title: 'เปิดเครื่องมือสร้าง', text: 'คลิก "เครื่องมือสร้าง" ที่แถบด้านบน หรือใช้ "สร้างด่วน" บนหน้าหลัก', screenshot: { src: 'support/create-activity-1.png', alt: 'หน้าเครื่องมือสร้าง' } },
    { title: 'เลือกประเภทผลงาน', text: 'เลือกหนึ่งในหกประเภท: แผนการสอน ใบงาน แบบทดสอบ สไลด์ เกณฑ์การประเมิน หรือกิจกรรมในชั้นเรียน' },
    { title: 'ตั้งค่าระดับชั้นและวิชา', text: 'เลือกระดับชั้นและวิชาเพื่อให้สื่อตรงกับชั้นเรียนของคุณ' },
    { title: 'เขียนคำสั่ง', text: 'บอกสิ่งที่ต้องการ — โหมดอิสระพิมพ์คำสั่งได้เลย หรือโหมดเทมเพลตกรอกแบบฟอร์มหัวข้อแล้วคำสั่งถูกสร้างให้อัตโนมัติ' },
    { title: 'สร้างและนำไปใช้', text: 'คลิก "สร้างเลย" ตรวจสอบผลลัพธ์บนหน้าพรีวิว แล้วบันทึกลงคลัง พิมพ์ หรือส่งออกเป็นรูปภาพ' },
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