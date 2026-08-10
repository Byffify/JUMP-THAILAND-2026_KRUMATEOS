import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TYPE_ORDER } from '../data/types.js';
import { STORE } from '../services/store.js';
import { API } from '../services/api.js';
import { useI18n } from '../context/I18nContext.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useEntranceAnimation } from '../hooks/useEntranceAnimation.js';
import GeneratorTab from '../components/GeneratorTab.jsx';
import RecentCard from '../components/RecentCard.jsx';
import SearchSuggest from '../components/SearchSuggest.jsx';

export default function DashboardPage() {
  const { t, lang } = useI18n();
  const { setLibQuery, setPendingPrompt, setPendingAllTypes } = useApp();
  const toast = useToast();
  const navigate = useNavigate();
  const qcRef = useEntranceAnimation();

  const [input, setInput] = useState('');
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const inputRef = useRef(null);

  const recent = STORE.recent(4);
  const metrics = STORE.metrics();

  useEffect(() => {
    let alive = true;
    setSuggestions(null);
    API.suggestions(lang).then(list => { if (alive) setSuggestions(list); });
    return () => { alive = false; };
  }, [lang]);

  const runSearch = useCallback((q) => {
    const term = (q || '').trim();
    if (!term) {
      toast(t('dash.searchEmpty'), 'error');
      if (inputRef.current) inputRef.current.focus();
      return;
    }
    STORE.addSearch(term);
    setInput(term);
    setSuggestOpen(false);
    setLibQuery(term);
    navigate('/library');
  }, [t, toast, setLibQuery, navigate]);

  return (
    <section id="page-dashboard" className="page">
      {/* Hero + search */}
      <div className="p-5 sm:p-8 mb-8">
        <p className="text-sm font-medium text-primary uppercase tracking-wide mb-1 text-center">{t('dash.eyebrow')}</p>
        <h1 className="text-2xl sm:text-4xl font-semibold leading-tight mb-2 text-center">{t('dash.headline')}</h1>
        <p className="text-muted text-sm sm:text-base mb-5 text-center">{t('dash.searchSub')}</p>
        <form
          id="dash-search-form"
          className="relative max-w-xl mx-auto block"
          onSubmit={e => { e.preventDefault(); runSearch(input); }}
        >
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">⌕</span>
          <input
            id="dash-search"
            type="search"
            className="input text-base sm:text-lg pl-11 pr-28 py-3.5"
            placeholder={t('dash.searchPh')}
            ref={inputRef}
            value={input}
            onChange={e => { setInput(e.target.value); setSuggestOpen(true); }}
            onFocus={() => setSuggestOpen(true)}
            onClick={() => setSuggestOpen(true)}
            onKeyDown={e => { if (e.key === 'Escape') setSuggestOpen(false); }}
          />
          <button id="dash-search-go" type="submit" className="btn btn-primary absolute right-2 top-1/2 -translate-y-1/2">
            {t('dash.searchBtn')}
          </button>
          <SearchSuggest
            value={input}
            inputRef={inputRef}
            open={suggestOpen}
            onOpenChange={setSuggestOpen}
            onSearch={runSearch}
          />
        </form>
      </div>

      {/* Quick Create */}
      <div className="bg-white shadow-card rounded-xl p-4 sm:p-5 mb-6 flex flex-col">
        <div className="flex items-baseline justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold">{t('dash.quickTitle')}</h2>
          <Link to="/generator" className="text-sm font-medium text-primary hover:underline text-end">{t('dash.viewAll')}</Link>
        </div>
        <div className="quick-panel">
          <div id="quick-create" ref={qcRef} className="quick-strip flex justify-center gap-3 overflow-x-auto" aria-label="Quick create types">
            {TYPE_ORDER.map((type, i) => (
              <GeneratorTab key={type} type={type} index={i} selected={false} onClick={() => navigate('/generator/' + type)} />
            ))}
          </div>
        </div>
      </div>

      {/* Time Saved */}
      <div className="rounded-2xl bg-dark text-white p-5 sm:p-6 mb-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-2xl">⏱</div>
          <div>
            <p className="font-semibold text-lg">{t('dash.timeTitle')}</p>
            <p className="text-white/70 text-sm">{t('dash.timeSub')}</p>
          </div>
        </div>
        <div className="flex items-center gap-6 sm:gap-10" id="time-stats">
          <div>
            <p className="text-3xl font-bold text-primary" id="stat-hours">{metrics.hoursSaved.toFixed(1)}h</p>
            <p className="text-xs text-white/70">{t('dash.statHours')}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary" id="stat-materials">{metrics.materials}</p>
            <p className="text-xs text-white/70">{t('dash.statMaterials')}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary" id="stat-generations">{metrics.generations}</p>
            <p className="text-xs text-white/70">{t('dash.statGenerated')}</p>
          </div>
        </div>
      </div>

      {/* Recent + Suggestions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-lg font-semibold">{t('dash.recentTitle')}</h2>
            <Link to="/library" className="text-sm font-medium text-primary hover:underline">{t('dash.viewLibrary')}</Link>
          </div>
          <div id="recent-list" className="space-y-3">
            {recent.length ? (
              recent.map(x => <RecentCard key={x.id} item={x} onClick={() => navigate('/content/' + x.id)} />)
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-line bg-white p-6 text-center text-sm text-muted">{t('dash.empty')}</div>
            )}
          </div>
        </div>
        <div>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-lg font-semibold">{t('dash.suggestTitle')}</h2>
          </div>
          <div id="suggest-list" className="space-y-3">
            {suggestions === null ? (
              <div className="card p-6 text-sm text-muted">{t('gen.loading')}</div>
            ) : (
              suggestions.map((s, i) => (
                <button
                  key={i}
                  className="card card-hover w-full text-left p-4 flex items-start gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={() => { setPendingPrompt(s.prompt); setPendingAllTypes(true); navigate('/generator'); }}
                >
                  <span className="w-8 h-8 shrink-0 rounded-lg bg-peach text-dark font-semibold flex items-center justify-center">{i + 1}</span>
                  <span>
                    <span className="block font-medium">{s.title}</span>
                    <span className="block text-xs text-muted">{s.prompt}</span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}