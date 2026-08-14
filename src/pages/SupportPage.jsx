import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../context/I18nContext.jsx';
import { GUIDE_CATS, FAQ_CATS, getGuide, getFaq } from '../data/support.js';
import SupportTabs from '../components/support/SupportTabs.jsx';
import FaqItem from '../components/support/FaqItem.jsx';

const TABS = [
  { id: 'guide', labelKey: 'support.guideTab' },
  { id: 'faq', labelKey: 'support.faqTab' },
];

export default function SupportPage() {
  const { t, lang } = useI18n();
  const [tab, setTab] = useState('guide');
  const [query, setQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const guide = useMemo(() => getGuide(lang), [lang]);
  const faq = useMemo(() => getFaq(lang), [lang]);
  const q = query.trim().toLowerCase();

  const filteredGuide = useMemo(() => {
    if (!q) return guide;
    return guide.filter(topic =>
      topic.title.toLowerCase().includes(q) ||
      topic.summary.toLowerCase().includes(q) ||
      (topic.steps || []).some(s => s.title.toLowerCase().includes(q) || s.text.toLowerCase().includes(q))
    );
  }, [guide, q]);

  const filteredFaq = useMemo(() => {
    if (!q) return faq;
    return faq.filter(entry =>
      entry.question.toLowerCase().includes(q) ||
      entry.answer.toLowerCase().includes(q)
    );
  }, [faq, q]);

  const hasResults = (tab === 'guide' ? filteredGuide : filteredFaq).length > 0;

  return (
    <section id="page-support" className="page">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold">{t('support.title')}</h1>
        <p className="text-muted text-sm mt-1">{t('support.sub')}</p>
      </div>

      <div className="relative max-w-xl mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">⌕</span>
        <input
          id="support-search"
          type="search"
          className="input"
          placeholder={t('support.searchPh')}
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <SupportTabs
        tabs={TABS.map(x => ({ id: x.id, label: t(x.labelKey) }))}
        active={tab}
        onChange={setTab}
      />

      {!hasResults ? (
        <div className="card p-8 text-center">
          <p className="text-muted mb-3">{t('support.noResults')}</p>
          <button className="btn btn-secondary" onClick={() => setQuery('')}>{t('support.clearSearch')}</button>
        </div>
      ) : tab === 'guide' ? (
        <div className="space-y-6">
          {groupByCat(filteredGuide).map(({ cat, topics }) => (
            <div key={cat.id} className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                {cat.icon && <img src={cat.icon} alt="" className="w-6 h-6 object-contain" />}
                <h2 className="text-base font-semibold">{t(cat.key)}</h2>
              </div>
              <div className="divide-y divide-line">
                {topics.map(topic => (
                  <Link
                    key={topic.id}
                    to={'/support/guide/' + topic.id}
                    className="flex items-center gap-3 py-3 text-left w-full"
                  >
                    {topic.icon && <img src={topic.icon} alt="" className="w-8 h-8 object-contain shrink-0" />}
                    <span className="flex-1 min-w-0">
                      <span className="block font-medium">{topic.title}</span>
                      <span className="block text-sm text-muted">{topic.summary}</span>
                    </span>
                    <span className="text-muted shrink-0">→</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {FAQ_CATS.map(cat => {
            const items = filteredFaq.filter(f => f.category === cat.id);
            if (!items.length) return null;
            return (
              <div key={cat.id} className="mb-6">
                <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                  {cat.icon && <img src={cat.icon} alt="" className="w-5 h-5 object-contain" />}
                  {t(cat.key)}
                </h2>
                {items.map(entry => (
                  <FaqItem
                    key={entry.id}
                    entry={entry}
                    open={openFaq === entry.id}
                    onToggle={() => setOpenFaq(openFaq === entry.id ? null : entry.id)}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function groupByCat(topics) {
  const map = new Map();
  topics.forEach(t => {
    if (!map.has(t.category)) map.set(t.category, []);
    map.get(t.category).push(t);
  });
  return GUIDE_CATS
    .filter(cat => map.has(cat.id))
    .map(cat => ({ cat, topics: map.get(cat.id) }));
}