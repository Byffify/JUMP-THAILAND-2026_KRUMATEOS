# KruMate OS — Release Notes

ฉบับสำหรับทีมพัฒนา — อัปเดตล่าสุด: 12 สิงหาคม 2026

---

## v1.0.0 (BETA)

### สรุปภาพรวม

KruMate OS เปิดตัวเวอร์ชัน Beta รุ่นแรก เทคโนโลยีหลักย้ายมาที่ **React 18 + Vite + Tailwind CSS** อย่างสมบูรณ์ จากเดิมที่เป็น Vanilla JS SPA โดยรักษาความเทียบเท่าของหน้าจอทุกหน้า (Parity) ไว้ทั้งหมด พร้อมเปิดใช้งาน AI จริงผ่าน **Gemini API** เพื่อสร้างสื่อการสอนให้ครูไทย

### ไฮไลต์ใหม่

- **React Migration ครบทุกหน้า** — ย้ายสถาปัตยกรรมจาก Vanilla JS ไป React 18 + Vite + Tailwind ครบทั้ง Dashboard, Generator, Content View, Library และ Assistant พร้อมตรวจสอบความเทียบเท่ากับเวอร์ชันเดิม
- **ระบบ AI สร้างสื่อด้วย Gemini** — สร้างแผนการสอน (Lesson Plan) และแบบทดสอบ (Quiz) ด้วย Generative AI จริง ผ่าน Gemini API
- **โครงสร้างแอปครบ** — i18n (ไทย/อังกฤษ), Toast, Modal, App Context, ระบบ Login Gate, HashRouter และ ระบบ Store เก็บข้อมูล
- **Export & แชร์หลากหลาย** — Copy, Print, Download และ **Export เป็นภาพ (PNG)** ด้วย html2canvas
- **หน้า Content View เฉพาะ** — หน้าดูเนื้อหาที่สร้างไว้แบบเต็มรูปแบบ แสดงสถานะบันทึก/ไม่บันทึก
- **รองรับการสร้างภาพ** — เพิ่ม support การ generate รูปภาพในงานสร้างสื่อ

### ฟีเจอร์ใหม่ล่าสุด

#### 1. โหมดสร้างจากเทมเพลต (Template Mode)

เพิ่มโหมดสร้างเนื้อหาจากแบบฟอร์มแทนการพิมพ์ Prompt ฟรี (Free Mode) โดยเลือกสลับได้ระหว่างสองโหมด:

- **โหมดเทมเพลต** — กรอกข้อมูลเป็นฟอร์ม: หัวข้อ, ระดับชั้น, วิชา, ระยะเวลา/จำนวนคาบ, จุดประสงค์การเรียนรู้ และหมายเหตุเพิ่มเติม ระบบจะประกอบเป็น Prompt อัตโนมัติและแสดงตัวอย่างก่อนส่ง
- **โหมดอิสระ** — พิมพ์ Prompt อธิบายสื่อที่ต้องการเอง

พร้อมตัวเลือกระดับชั้น (Level) และวิชา (Subject) ที่กำหนดเองได้ ใช้ได้ทั้งภาษาไทยและอังกฤษ

#### 2. ความปลอดภัยของ API Key (สำคัญ)

ปรับย้ายการเรียก Gemini ให้ผ่าน **Serverless Proxy (Vercel Serverless Function)** แทนการฝัง Key ใน client bundle:

- Key เก็บอยู่ฝั่ง Server เท่านั้น (`GEMINI_API_KEY` ใน Environment) ไม่ถูกส่งลงเว็บที่ผู้ใช้ดาวน์โหลดได้
- Client เรียก `POST /api/gemini` ผ่าน proxy พร้อมตรวจสอบความยาว prompt (สูงสุด 10,000 ตัวอักษร) และขนาด output
- มีการ **Fallback เป็น Mock Data** อัตโนมัติเมื่อ Gemini ไม่พร้อมใช้งาน (เช่น ไม่ได้ตั้งค่า Key) เพื่อให้งานเดโมไม่สะดุด

#### 3. Rebranding เป็น KruMate

- เปลี่ยนโลโก้เป็น **KruMate** ทั้งภาพเต็ม (full-logo) และโลโก้ขนาดเล็ก (mini-logo) ทุกหน้า
- ปรับปรุงและแก้ไข UI ของทุกหน้า รวมถึงการประกาศการใช้งาน, คำแปลภาษา และการจัด layout

### การแก้ไขบั๊ก (Fixes)

- แก้ padding ของช่องค้นหา (Dashboard Search) และจัดกึ่งกลาง Quick Create
- แก้บั๊กการ pre-select ประเภทเนื้อหาจาก Dashboard ให้เลือกทุกประเภทครบถ้วน
- แก้ไขและทดสอบหน้าจอทุกหน้า (Dashboard, Generator, Library, Content View) หลัง migration
- แก้ไขระบบ i18n และการแสดงผลคำแปลในหลายจุด

### ฟีเจอร์เดิมที่ยังคงมี (จากเวอร์ชันก่อนหน้า)

- Dashboard พร้อม Prompt Box หลัก, Quick Create, Recent Creations, Time Saved และ AI Suggestions
- ตัวเลือกประเภทเนื้อหาเดียว (Single-Type Selection) พร้อมตัวเลือก ระดับชั้น + วิชา
- ระบบสรุปเวลา (Time Saved) และการบันทึกการสร้างเนื้อหา
- AI Assistant แบบสนทนา

### การติดตั้ง / ตั้งค่า

```bash
npm install
npm run dev          # รัน dev server
npm run build        # build production
```

**สำหรับรันด้วย Gemini จริง** ต้องตั้งค่า Serverless Function:

1. Deploy ฟังก์ชัน `api/gemini.js` (Vercel Serverless)
2. ตั้ง Environment Variable: `GEMINI_API_KEY=<your_key>`
3. กำหนด `VITE_API_TARGET` ชี้ไปที่ endpoint ของ proxy (ถ้า dev ต่างเครื่อง)

ถ้ายังไม่ได้ตั้งค่า ระบบจะทำงานด้วย Mock Data อัตโนมัติ

### Known Limitations

- ยังเป็นเวอร์ชัน Beta Status เนื้อหาที่ยังไม่ได้เข้า Content Library อยู่ในหน่วยความจำชั่วคราว
- จำนวนคำถามต่อ Quiz จำกัดที่ 5–30 ข้อ
- ยังไม่มีระบบล็อกอินจริง (Auth Gate เป็นแบบจำลอง)
- รองรับ Gemini model default: `gemini-3.5-flash-lite`

---

*Release Notes จัดทำจากประวัติ Commit บนสาขา `Fiat` (อัปเดตล่าสุด `d2b78a1`)*