import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TYPE_ORDER, LEVELS, SUBJECTS, levelLabel } from '../data/types.js';
import { API } from '../services/api.js';
import { Live } from '../services/store.js';
import { useI18n } from '../context/I18nContext.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useEntranceAnimation } from '../hooks/useEntranceAnimation.js';
import GeneratorTab from '../components/GeneratorTab.jsx';

const QUIZ_KINDS = [
  { value: 'mc', key: 'gen.kindMc' },
  { value: 'tf', key: 'gen.kindTf' },
  { value: 'sa', key: 'gen.kindSa' },
];

export default function GeneratorPage() {
  const { t, lang } = useI18n();
  const toast = useToast();
  const navigate = useNavigate();
  const { type: routeType } = useParams();
  const {
    user,
    quizKinds, setQuizKinds,
    quizCount, setQuizCount,
    pendingPrompt, setPendingPrompt,
  } = useApp();
  const genRef = useEntranceAnimation();

  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const promptRef = useRef(null);

  const [selectedType, setSelectedType] = useState(() =>
    routeType && TYPE_ORDER.includes(routeType) ? routeType : 'lesson'
  );
  const [level, setLevel] = useState('p4');
  const [subject, setSubject] = useState(() =>
    user && SUBJECTS.some(s => s.value === user.subject) ? user.subject : 'Science'
  );

  useEffect(() => {
    if (pendingPrompt) {
      setPrompt(pendingPrompt);
      setPendingPrompt(null);
    }
  }, [pendingPrompt, setPendingPrompt]);

  const toggleKind = useCallback(k => {
    setQuizKinds(prev =>
      prev.includes(k) ? prev.filter(k2 => k2 !== k) : [...prev, k]
    );
  }, [setQuizKinds]);

  const summary = t('gen.summary');

  const ctaLabel = t('gen.cta');

  const doGenerate = useCallback(async () => {
    if (generating) return;
    const value = prompt.trim();
    if (!value) {
      toast(t('gen.error.prompt'), 'error');
      if (promptRef.current) promptRef.current.focus();
      return;
    }
    const types = [selectedType];
    if (types.includes('quiz') && !quizKinds.length) {
      toast(t('gen.error.quizKinds'), 'error');
      return;
    }

    setGenerating(true);
    toast(t('gen.loading') + ' ' + t('gen.loadingSub'));

    try {
      const quizOpts = { count: Number(quizCount), kinds: quizKinds };
      const items = await API.generate({ prompt: value, types, quizOpts, level, subject, lang });
      const item = items[0];
      Live.put(item);
      navigate('/content/' + item.id);
    } catch (err) {
      toast(t('gen.error.failed'), 'error');
    } finally {
      setGenerating(false);
    }
  }, [generating, prompt, selectedType, level, subject, quizKinds, quizCount, t, toast, navigate]);

  return (
    <section id="page-generator" className="page">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold">{t('gen.title')}</h1>
        <p className="text-muted text-sm mt-1">{t('gen.sub')}</p>
      </div>

      <div className="rounded-2xl bg-white border border-line shadow-card p-5 sm:p-8 mb-6">
        <label htmlFor="gen-prompt" className="block text-sm font-medium mb-2">{t('gen.promptLabel')}</label>
        <textarea
          id="gen-prompt"
          ref={promptRef}
          rows="3"
          className="input text-base mb-3"
          placeholder={t('dash.promptPlaceholder')}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        ></textarea>
        <div id="gen-error" className="hidden text-sm text-red-600 mb-3"></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center mb-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="gen-level" className="text-sm font-medium text-muted">{t('gen.levelLabel')}</label>
          <select id="gen-level" className="input sm:w-48" value={level} onChange={e => setLevel(e.target.value)}>
            {LEVELS.map(lv => (
              <option key={lv.value} value={lv.value}>{levelLabel(lv.value, lang)}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="gen-subject" className="text-sm font-medium text-muted">{t('gen.subjectLabel')}</label>
          <select id="gen-subject" className="input sm:w-48" value={subject} onChange={e => setSubject(e.target.value)}>
            {SUBJECTS.map(s => (
              <option key={s.value} value={s.value}>{t(s.key)}</option>
            ))}
          </select>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-3">{t('gen.typesTitle')}</h2>
      <div
        id="gen-types"
        ref={genRef}
        className="generator-tabs mb-4"
        role="tablist"
        aria-label="Output types"
      >
        {TYPE_ORDER.map((type, i) => (
          <GeneratorTab
            key={type}
            type={type}
            index={i}
            selected={selectedType === type}
            onClick={() => setSelectedType(type)}
            dataType={type}
            tabIndex={0}
            role="tab"
            ariaSelected={selectedType === type}
          />
        ))}
      </div>

      <div
        id="quiz-options"
        className={'rounded-2xl bg-white border border-line shadow-card p-5 mb-6' + (selectedType === 'quiz' ? '' : ' hidden')}
      >
        <p className="font-medium mb-3">{t('gen.quizTitle')}</p>
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <label className="block text-sm text-muted mb-1">{t('gen.numQuestions')}</label>
            <input
              id="quiz-count"
              type="number"
              min="5"
              max="30"
              step="1"
              value={quizCount}
              onChange={e => setQuizCount(Number(e.target.value) || 0)}
              className="input w-24"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            {QUIZ_KINDS.map(kind => (
              <label key={kind.value} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="quiz-kind w-4 h-4 text-primary rounded"
                  value={kind.value}
                  checked={quizKinds.includes(kind.value)}
                  onChange={() => toggleKind(kind.value)}
                />
                <span>{t(kind.key)}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div id="gen-summary" className="text-sm text-muted">{summary}</div>
        <button
          id="gen-generate"
          className="btn btn-primary text-base px-8 py-3.5"
          disabled={generating}
          onClick={doGenerate}
        >
          {generating ? (
            <>
              <span className="spinner"></span>
              <span>{t('gen.loading')}</span>
            </>
          ) : (
            ctaLabel
          )}
        </button>
      </div>
    </section>
  );
}