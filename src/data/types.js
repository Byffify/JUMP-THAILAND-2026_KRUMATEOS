export const TYPE_META = {
  lesson:    { asset: 'assets/plan_for_teacher.png',      key: 'type.lesson' },
  worksheet: { asset: 'assets/Worksheet.png',             key: 'type.worksheet' },
  quiz:      { asset: 'assets/Quiz.png',                  key: 'type.quiz' },
  slides:    { asset: 'assets/Presentation Slides.png',   key: 'type.slides' },
  rubric:    { asset: 'assets/Assessment.png',            key: 'type.rubric' },
  activity:  { asset: 'assets/Class Activity.png',        key: 'type.activity' },
};
export const TYPE_ORDER = ['lesson', 'worksheet', 'quiz', 'slides', 'rubric', 'activity'];
export const assetFor = t => (TYPE_META[t] || {}).asset;
export const labelFor = t => (TYPE_META[t] || { key: 'type.lesson' }).key;

export const LEVELS = [
  { value: 'k',  label: { en: 'Kindergarten', th: 'อนุบาล' } },
  { value: 'p1', label: { en: 'Grade 1', th: 'ชั้น ป.1' } },
  { value: 'p2', label: { en: 'Grade 2', th: 'ชั้น ป.2' } },
  { value: 'p3', label: { en: 'Grade 3', th: 'ชั้น ป.3' } },
  { value: 'p4', label: { en: 'Grade 4', th: 'ชั้น ป.4' } },
  { value: 'p5', label: { en: 'Grade 5', th: 'ชั้น ป.5' } },
  { value: 'p6', label: { en: 'Grade 6', th: 'ชั้น ป.6' } },
  { value: 'm1', label: { en: 'M.1', th: 'ชั้น ม.1' } },
  { value: 'm2', label: { en: 'M.2', th: 'ชั้น ม.2' } },
  { value: 'm3', label: { en: 'M.3', th: 'ชั้น ม.3' } },
  { value: 'm4', label: { en: 'M.4', th: 'ชั้น ม.4' } },
  { value: 'm5', label: { en: 'M.5', th: 'ชั้น ม.5' } },
  { value: 'm6', label: { en: 'M.6', th: 'ชั้น ม.6' } }
];

export const SUBJECTS = [
  { value: 'Science',        key: 'login.subjectScience' },
  { value: 'Mathematics',    key: 'login.subjectMath' },
  { value: 'Thai',           key: 'login.subjectThai' },
  { value: 'English',        key: 'login.subjectEnglish' },
  { value: 'Social Studies', key: 'login.subjectSocial' },
  { value: 'Other',          key: 'login.subjectOther' },
  { value: 'Physics',        key: 'gen.subjectPhysics' },
  { value: 'Chemistry',      key: 'gen.subjectChemistry' },
  { value: 'Biology',        key: 'gen.subjectBiology' },
  { value: 'History',        key: 'gen.subjectHistory' },
  { value: 'Geography',      key: 'gen.subjectGeography' },
  { value: 'Computing',      key: 'gen.subjectComputing' }
];

export function levelLabel(value, lang) {
  const l = LEVELS.find(entry => entry.value === value);
  return l ? (l.label[lang] || l.label.en || '') : '';
}