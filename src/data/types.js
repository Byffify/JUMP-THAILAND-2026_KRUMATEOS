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