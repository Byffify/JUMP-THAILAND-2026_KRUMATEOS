/* ==========================================================================
   KruMate OS — Placeholder AI API layer
   Simulates a backend with latency. This is the single swap-point for a real
   AI service later: keep the same async signatures (generate / suggest /
   assistant) and the UI keeps working unchanged.
   ========================================================================== */
import { generateItems } from '../data/generator.js';
import { STORE } from './store.js';

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

function randomLatency() { return 700 + Math.floor(Math.random() * 600); } // 700–1300ms

export const API = {
  /**
   * Generate materials from a teaching prompt.
   * @returns {Promise<Array>} resolved with generated item objects
   */
  async generate({ prompt, types, quizOpts, level, subject }) {
    await wait(randomLatency());
    const items = generateItems(prompt, types, quizOpts, { level, subject });
    STORE.recordGeneration(items.length);
    return items;
  },

  /**
   * Dashboard AI suggestions (topic ideas for the teacher).
   * @returns {Promise<Array>} [{prompt, tagline}]
   */
  async suggestions(lang) {
    await wait(200 + Math.floor(Math.random() * 300));
    const th = lang === 'th';
    return [
      { title: th ? 'ระบบสุริยะ' : 'Solar system', prompt: th ? 'สร้างบทเรียนวิทยาศาสตร์ชั้น ป.6 เรื่องระบบสุริยะ' : 'Create a Grade 6 science lesson about the solar system' },
      { title: th ? 'การคูณเศษส่วน' : 'Multiplying fractions', prompt: th ? 'สร้างใบงานการคูณเศษส่วน' : 'Generate a worksheet on multiplying fractions' },
      { title: th ? 'การเปลี่ยนแปลงสภาพภูมิอากาศ' : 'Climate change', prompt: th ? 'สร้างข้อสอบ 10 ข้อเรื่องการเปลี่ยนแปลงสภาพภูมิอากาศ' : 'Create a 10-question quiz on climate change' },
      { title: th ? 'การสังเคราะห์แสง' : 'Photosynthesis', prompt: th ? 'สร้างสไลด์การสังเคราะห์แสง' : 'Create slides about photosynthesis' },
      { title: th ? 'มารยาทในการฟัง' : 'Listening manners', prompt: th ? 'สร้างบทเรียนภาษาไทยเรื่องมารยาทในการฟัง' : 'Create a Thai language lesson about listening manners' }
    ];
  },

  /**
   * Conversational assistant (mock).
   * @returns {Promise<string>}
   */
  async assistant(message, lang) {
    await wait(randomLatency());
    const th = lang === 'th';
    const m = (message || '').trim();
    const prompt = th
      ? (m.includes('แบบทดสอบ') || m.includes('ข้อสอบ') ? 'ข้อสอบ' : m.includes('ใบงาน') ? 'ใบงาน' : m.includes('สไลด์') ? 'สไลด์' : 'บทเรียน')
      : (/(quiz)/i.test(m) ? 'quiz' : /(worksheet)/i.test(m) ? 'worksheet' : /(slide)/i.test(m) ? 'slides' : 'lesson');

    if (th) {
      return 'ได้เลยค่ะ/ครับ! นี่คือแนวทางที่แนะนำสำหรับ "' + prompt + '":\\n\\n' +
        '1. เริ่มจากจุดประสงค์การเรียนรู้ 2–3 ข้อที่วัดได้จริง\\n' +
        '2. เลือกกิจกรรมให้หลากหลาย เช่น เกม จับคู่ หรือลงมือทำ\\n' +
        '3. ใช้ใบงานหรือข้อสอบสั้น ๆ ตรวจสอบความเข้าใจ\\n' +
        '4. ปิดท้ายด้วยการสรุปและ Exit Ticket\\n\\n' +
        'ลองกด "สร้างเลย" พร้อมคำสั่ง: ' + (m ? '"' + m + '"' : '') + ' เพื่อให้ KruMate สร้างสื่อให้คุณดูค่ะ/ครับ!';
    }
    return 'Here is a quick teaching approach for that:\\n\\n' +
      '1. Start with 2–3 measurable learning objectives\\n' +
      '2. Mix activity types — games, pair work, hands-on tasks\\n' +
      '3. Check understanding with a short worksheet or quiz\\n' +
      '4. Close with a summary and an exit ticket\\n\\n' +
      'Paste your prompt into the Generator and I can build it for you: ' + (m ? '“' + m + '”' : '');
  }
};