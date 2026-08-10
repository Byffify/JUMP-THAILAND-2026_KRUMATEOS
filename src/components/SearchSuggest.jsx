import { useCallback, useEffect, useRef, useState } from 'react';
import { STORE } from '../services/store.js';
import { escapeAttr, sanitize } from '../utils/format.js';
import { useI18n } from '../context/I18nContext.jsx';

export default function SearchSuggest({ onSearch }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const panelRef = useRef(null);
  const inputRef = useRef(null);

  const reRender = useCallback((term) => setInput(term), []);

  useEffect(() => {
    if (!open) return;
    const onDoc = e => {
      if (!panelRef.current || panelRef.current.contains(e.target)) return;
      if (e.target === inputRef.current) return;
      setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, [open]);

  const q = input.trim().toLowerCase();
  const all = STORE.searchHistory(10);
  const matches = q ? all.filter(e => (e.term || '').toLowerCase().includes(q)) : all;
  const popular = matches.slice().sort((a, b) => (b.count || 0) - (a.count || 0)).slice(0, 8);
  const recent = matches.slice(0, 8);

  let body;
  if (!all.length) {
    body = <div className="p-6 text-center text-sm text-muted">{t('dash.noHistory')}</div>;
  } else if (!matches.length) {
    body = <div className="p-6 text-center text-sm text-muted">{t('dash.noResults')}</div>;
  } else {
    body = (
      <>
        {recent.length > 0 && (
          <div className="dash-suggest-section">
            <div className="dash-suggest-head">
              <span className="dash-suggest-title">{t('dash.historyTitle')}</span>
              <button type="button" className="dash-suggest-clear" id="dash-suggest-clear-all"
                      onClick={() => { STORE.clearSearchHistory(); reRender(input); }}>
                {t('dash.clearAll')}
              </button>
            </div>
            <div className="dash-suggest-rows" onClick={e => {
              const del = e.target.closest('[data-del]');
              if (del) { STORE.removeSearch(del.dataset.del); reRender(input); return; }
              const term = e.target.closest('[data-term]');
              if (term) onSearch(term.dataset.term);
            }}>
              {recent.map(e => (
                <button key={e.term} type="button" className="dash-suggest-row w-full" data-term={e.term}>
                  <span className="flex-1 min-w-0 truncate">{e.term}</span>
                  <span className="dash-suggest-del" data-del={e.term} role="button" tabIndex={-1}
                        aria-label={t('dash.removeSearch') + ': ' + e.term}>×</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {popular.length > 0 && (
          <div className="dash-suggest-section">
            <div className="dash-suggest-head">
              <span className="dash-suggest-title">{t('dash.popular')}</span>
            </div>
            <div className="dash-suggest-chips" onClick={e => {
              const term = e.target.closest('[data-term]');
              if (term) onSearch(term.dataset.term);
            }}>
              {popular.map(c => (
                <button key={c.term} type="button" className="dash-suggest-chip" data-term={c.term}>
                  <span aria-hidden="true">↗</span> {c.term}
                </button>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div ref={panelRef}
         id="dash-search-suggest"
         className={open ? 'absolute left-0 right-0 top-full mt-2' : 'hidden absolute left-0 right-0 top-full mt-2'}>
      {open && body}
    </div>
  );
}