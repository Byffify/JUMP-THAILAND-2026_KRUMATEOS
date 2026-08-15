/* ==========================================================================
   KruMate OS — Library page
   Port of js/app.js renderLibrary (735-796) + chrome markup from index.html.
   Class names, ids, glyphs and markup structure preserved verbatim.
   ========================================================================== */
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { STORE } from '../services/store.js';
import { assetFor, labelFor, SUBJECTS } from '../data/types.js';
import { LEVELS } from '../data/types.js';
import { TEMPLATES } from '../data/curriculum/index.js';
import { fmtDate } from '../utils/format.js';
import { levelLabel } from '../data/types.js';
import { loc } from '../components/ItemRenderers.jsx';
import { useI18n } from '../context/I18nContext.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useModal } from '../context/ModalContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

function chipColor(t) {
  return {
    lesson: 'bg-peach/60 text-dark',
    worksheet: 'bg-soft text-dark',
    quiz: 'bg-primary/25 text-dark',
    slides: 'bg-dark/10 text-dark',
    rubric: 'bg-peach/30 text-dark',
    activity: 'bg-primary/15 text-dark'
  }[t] || 'bg-soft text-dark';
}

export default function LibraryPage() {
  const { t, lang } = useI18n();
  const { libQuery, setLibQuery } = useApp();
  const openModal = useModal();
  const toast = useToast();
  const navigate = useNavigate();

  const [input, setInput] = useState('');
  const [cat, setCat] = useState('');
  const [subj, setSubj] = useState('');
  const [type, setType] = useState('all');
  const [, setTick] = useState(0);

  const [tab, setTab] = useState('mine');
  const [tplQ, setTplQ] = useState('');
  const [tplSubj, setTplSubj] = useState('');
  const [tplGrade, setTplGrade] = useState('');

  const tplFiltered = TEMPLATES.filter(t => {
    const q = tplQ.trim().toLowerCase();
    const hay = [t.topic.th, t.topic.en, t.subject, ...(t.indicators || [])].join(' ').toLowerCase();
    if (q && !hay.includes(q)) return false;
    if (tplSubj && t.subject !== tplSubj) return false;
    if (tplGrade && t.grade !== tplGrade) return false;
    return true;
  });

  useEffect(() => {
    if (libQuery !== undefined) {
      setInput(libQuery);
      setLibQuery(undefined);
    }
  }, [libQuery, setLibQuery]);

  const cats = STORE.categories();
  const items = STORE.search(input, type, cat, subj);

  const chipOpts = [
    { val: 'all', label: t('lib.filterAll') },
    { val: 'lesson', label: t('lib.filterLesson') },
    { val: 'worksheet', label: t('lib.filterWorksheet') },
    { val: 'quiz', label: t('lib.filterQuiz') },
    { val: 'slides', label: t('lib.filterSlides') },
    { val: 'rubric', label: t('lib.filterRubric') },
    { val: 'activity', label: t('lib.filterActivity') }
  ];

  const onDelete = async item => {
    const ok = await openModal({
      title: t('lib.deleteTitle'),
      body: t('lib.deleteBody', { title: item.title }),
      confirm: t('lib.deleteConfirm'),
      cancel: t('lib.deleteCancel'),
      danger: true
    });
    if (!ok) return;
    STORE.delete(item.id);
    toast(t('lib.toastDeleted'));
    setTick(n => n + 1);
  };

  return (
    <section id="page-library" className="page">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">{t('lib.title')}</h1>
          <p className="text-muted text-sm mt-1">{t('lib.sub')}</p>
        </div>
        <Link to="/generator" className="btn btn-primary">{t('lib.new')}</Link>
      </div>

      <div className="flex gap-2 mb-6" role="tablist">
        <button
          role="tab"
          aria-selected={tab === 'mine'}
          className={'chip ' + (tab === 'mine' ? 'chip-active' : '')}
          onClick={() => setTab('mine')}
        >
          {t('lib.tabMine')}
        </button>
        <button
          role="tab"
          aria-selected={tab === 'templates'}
          className={'chip ' + (tab === 'templates' ? 'chip-active' : '')}
          onClick={() => setTab('templates')}
        >
          {t('lib.tabTemplates')}
        </button>
      </div>

      {tab === 'mine' && (
        <>
      <div className="rounded-2xl bg-white border border-line shadow-card p-4 mb-6 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">⌕</span>
          <input
            id="lib-search"
            type="search"
            className="input pl-9"
            placeholder={t('lib.searchPh')}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>
        <select
          id="lib-category"
          className="input md:w-52"
          value={cat}
          onChange={e => setCat(e.target.value)}
        >
          <option value="">{t('lib.allCat')}</option>
          {cats.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          id="lib-subject"
          className="input md:w-52"
          value={subj}
          onChange={e => setSubj(e.target.value)}
        >
          <option value="">{t('lib.allSub')}</option>
          {SUBJECTS.map(s => (
            <option key={s.value} value={s.value}>{t(s.key)}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2 mb-6" id="lib-filters">
        {chipOpts.map(c => (
          <button
            key={c.val}
            className={'chip ' + (type === c.val ? 'chip-active' : '')}
            data-fval={c.val}
            onClick={() => setType(c.val)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div id="lib-grid" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length ? items.map(i => (
          <div key={i.id} className="card card-hover overflow-hidden flex flex-col">
            <button
              className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => navigate('/content/' + i.id)}
            >
              <img src={assetFor(i.type)} alt="" className="w-full aspect-[4/3] object-contain p-2 border-b border-line bg-soft/40" />
            </button>
            <div className="p-4 flex-1">
              <span className={'inline-block text-[11px] px-2 py-0.5 rounded-full ' + chipColor(i.type) + ' mb-2'}>{t(labelFor(i.type))}</span>
              <p className="font-semibold leading-snug mb-1">{i.title}</p>
              <p className="text-xs text-muted">{i.grade || ''}{i.grade && i.subject ? ' · ' : ' '}{i.subject || ''}</p>
              <p className="text-xs text-muted mt-2">{t('lib.updatedAt')}: {fmtDate(i.updatedAt || i.createdAt)}</p>
            </div>
            <div className="px-4 pb-4 flex gap-2">
              <button className="btn btn-secondary flex-1 text-sm" onClick={() => navigate('/content/' + i.id)}>{t('lib.open')}</button>
              <button className="btn btn-ghost px-3 text-sm" onClick={() => onDelete(i)} aria-label={t('lib.deleteConfirm')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full text-center py-8 text-muted text-sm">{t('lib.noResults')}</div>
        )}
      </div>

      <div id="lib-empty" className={'text-center py-16' + (items.length > 0 ? ' hidden' : '')}>
        <p className="font-medium">{t('lib.emptyTitle')}</p>
        <p className="text-muted text-sm mt-1">{t('lib.emptySub')}</p>
      </div>
        </>
      )}

      {tab === 'templates' && (
        <div>
          <p className="text-xs text-muted mb-3">{t('lib.templateDisclaimer')}</p>
          <div className="rounded-2xl bg-white border border-line shadow-card p-4 mb-6 flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">⌕</span>
              <input
                type="search"
                className="input pl-9"
                placeholder={t('lib.templateSearchPh')}
                value={tplQ}
                onChange={e => setTplQ(e.target.value)}
              />
            </div>
            <select className="input md:w-52" value={tplSubj} onChange={e => setTplSubj(e.target.value)}>
              <option value="">{t('lib.allSub')}</option>
              {SUBJECTS.map(s => (
                <option key={s.value} value={s.value}>{t(s.key)}</option>
              ))}
            </select>
            <select className="input md:w-52" value={tplGrade} onChange={e => setTplGrade(e.target.value)}>
              <option value="">{t('lib.templateAllGrade')}</option>
              {LEVELS.filter(l => l.value !== 'k').map(l => (
                <option key={l.value} value={l.value}>{levelLabel(l.value, lang)}</option>
              ))}
            </select>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tplFiltered.map(tp => (
              <div key={tp.id} className="card card-hover overflow-hidden flex flex-col">
                <button
                  className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={() => navigate('/content/' + tp.id)}
                >
                  <img src={assetFor('slides')} alt="" className="w-full aspect-[4/3] object-contain p-2 border-b border-line bg-soft/40" />
                </button>
                <div className="p-4 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={'inline-block text-[11px] px-2 py-0.5 rounded-full ' + chipColor('slides')}>{t('lib.templateBadge')}</span>
                  </div>
                  <p className="font-semibold leading-snug mb-1">{loc(tp.topic, lang)}</p>
                  <p className="text-xs text-muted">{levelLabel(tp.grade, lang)} · {t(SUBJECTS.find(s => s.value === tp.subject)?.key || tp.subject)}</p>
                  {tp.indicators.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tp.indicators.map((ind, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-soft text-muted max-w-full truncate" title={ind}>{ind}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="px-4 pb-4">
                  <button className="btn btn-secondary w-full text-sm" onClick={() => navigate('/content/' + tp.id)}>{t('lib.open')}</button>
                </div>
              </div>
            ))}
            {tplFiltered.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted text-sm">{t('lib.templateNoResults')}</div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}