import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TYPE_ORDER } from '../data/types.js';
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
  const { t } = useI18n();
  const toast = useToast();
  const navigate = useNavigate();
  const { type: routeType } = useParams();
  const {
    selectedTypes, setSelectedTypes, toggleType,
    quizKinds, setQuizKinds,
    quizCount, setQuizCount,
    pendingPrompt, setPendingPrompt,
    pendingAllTypes, setPendingAllTypes,
  } = useApp();
  const genRef = useEntranceAnimation();

  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const promptRef = useRef(null);

  useEffect(() => {
    if (routeType && TYPE_ORDER.includes(routeType)) {
      setSelectedTypes(new Set([routeType]));
    } else if (pendingAllTypes) {
      setSelectedTypes(new Set(TYPE_ORDER));
    }
    if (pendingAllTypes) setPendingAllTypes(false);
  }, [routeType, pendingAllTypes, setSelectedTypes, setPendingAllTypes]);

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

  const summary = selectedTypes.size
    ? t('gen.summary', { n: selectedTypes.size })
    : t('gen.summaryEmpty');

  const ctaLabel = '✨ ' + t('gen.cta').replace(/✨\s?/, '');

  const doGenerate = useCallback(async () => {
    if (generating) return;
    const value = prompt.trim();
    if (!value) {
      toast(t('gen.error.prompt'), 'error');
      if (promptRef.current) promptRef.current.focus();
      return;
    }
    if (!selectedTypes.size) {
      toast(t('gen.error.none'), 'error');
      return;
    }
    const types = TYPE_ORDER.filter(x => selectedTypes.has(x));
    if (types.includes('quiz') && !quizKinds.length) {
      toast(t('gen.error.quizKinds'), 'error');
      return;
    }

    setGenerating(true);
    toast(t('gen.loading') + ' ' + t('gen.loadingSub'));

    try {
      const quizOpts = { count: Number(quizCount), kinds: quizKinds };
      const items = await API.generate({ prompt: value, types, quizOpts });
      const first = items[0];
      items.forEach(it => Live.put(it));
      if (items.length > 1) first._bundle = items.map(i => i.id);
      navigate('/content/' + first.id);
    } catch (err) {
      toast(t('gen.error.failed'), 'error');
    } finally {
      setGenerating(false);
    }
  }, [generating, prompt, selectedTypes, quizKinds, quizCount, t, toast, navigate]);

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
            selected={selectedTypes.has(type)}
            onClick={() => toggleType(type)}
            dataType={type}
            tabIndex={0}
            role="tab"
            ariaSelected={selectedTypes.has(type)}
          />
        ))}
      </div>

      <div
        id="quiz-options"
        className={'rounded-2xl bg-white border border-line shadow-card p-5 mb-6' + (selectedTypes.has('quiz') ? '' : ' hidden')}
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