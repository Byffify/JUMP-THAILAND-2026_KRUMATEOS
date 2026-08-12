import { LEVELS, SUBJECTS, levelLabel } from '../data/types.js';
import { useI18n } from '../context/I18nContext.jsx';

export default function PromptTemplate({ values, handlers, lang }) {
  const { t } = useI18n();
  return (
    <div className="prompt-template grid gap-4">
      <div>
        <label htmlFor="tpl-topic" className="block text-sm font-medium mb-1.5">{t('gen.topicLabel')}</label>
        <input
          id="tpl-topic"
          type="text"
          className="input"
          placeholder={t('gen.topicPh')}
          value={values.topic}
          onChange={handlers.topic}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="tpl-level" className="block text-sm font-medium mb-1.5">{t('gen.levelLabel')}</label>
          <select id="tpl-level" className="input w-full" value={values.level} onChange={handlers.level}>
            {LEVELS.map(lv => (
              <option key={lv.value} value={lv.value}>{levelLabel(lv.value, lang)}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="tpl-subject" className="block text-sm font-medium mb-1.5">{t('gen.subjectLabel')}</label>
          <select id="tpl-subject" className="input w-full" value={values.subject} onChange={handlers.subject}>
            {SUBJECTS.map(s => (
              <option key={s.value} value={s.value}>{t(s.key)}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="tpl-duration" className="block text-sm font-medium mb-1.5">{t('gen.durationLabel')}</label>
        <input
          id="tpl-duration"
          type="text"
          className="input"
          placeholder={t('gen.durationPh')}
          value={values.duration}
          onChange={handlers.duration}
        />
      </div>
      <div>
        <label htmlFor="tpl-objectives" className="block text-sm font-medium mb-1.5">{t('gen.objectivesLabel')}</label>
        <textarea
          id="tpl-objectives"
          rows="2"
          className="input"
          placeholder={t('gen.objectivesPh')}
          value={values.objectives}
          onChange={handlers.objectives}
        ></textarea>
      </div>
      <div>
        <label htmlFor="tpl-notes" className="block text-sm font-medium mb-1.5">{t('gen.notesLabel')}</label>
        <textarea
          id="tpl-notes"
          rows="2"
          className="input"
          placeholder={t('gen.notesPh')}
          value={values.notes}
          onChange={handlers.notes}
        ></textarea>
      </div>
    </div>
  );
}