/* ==========================================================================
   KruMate OS — SlideshowView
   Single-slide 16:9 slideshow for type==='slides' items, with a toggle to
   the grid view and an off-screen all-slides container for image export.
   ========================================================================== */
import { useEffect, useRef, useState } from 'react';
import { renderSlideCard, renderSlides } from './ItemRenderers.jsx';
import { useI18n } from '../context/I18nContext.jsx';

export default function SlideshowView({ item, lang, captureRef }) {
  const { t } = useI18n();
  const total = (item.slides || []).length;
  const [index, setIndex] = useState(0);
  const [view, setView] = useState('show');
  const go = n => setIndex(Math.max(0, Math.min(n, total - 1)));

  useEffect(() => {
    setIndex(0);
  }, [item.id]);

  useEffect(() => {
    if (view !== 'show') return;
    const onKey = e => {
      const el = document.activeElement;
      if (el && ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') go(Math.min(index + 1, total - 1));
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(Math.max(index - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view, index, total]);

  if (total === 0) return null;

  if (view === 'grid') {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <button className="btn btn-secondary text-sm" onClick={() => setView('show')}>
            {t('slideshow.viewShow')}
          </button>
        </div>
        {renderSlides(item, lang)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button className="btn btn-secondary text-sm" onClick={() => setView('grid')}>
          {t('slideshow.viewGrid')}
        </button>
      </div>

      <div className="bg-soft/60 rounded-3xl p-4 sm:p-10">
        <div className="max-w-4xl mx-auto">{renderSlideCard(item.slides[index], index, lang)}</div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button className="btn btn-secondary" disabled={index === 0} onClick={() => go(index - 1)}>
          ◀ {t('slideshow.prev')}
        </button>
        <span className="text-sm text-muted font-medium tabular-nums">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <button className="btn btn-secondary" disabled={index === total - 1} onClick={() => go(index + 1)}>
          {t('slideshow.next')} ▶
        </button>
      </div>

      <div className="flex justify-center gap-1.5">
        {item.slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={'w-2.5 h-2.5 rounded-full ' + (i === index ? 'bg-primary' : 'bg-line')}
          />
        ))}
      </div>

      <div
        id="slide-capture"
        ref={captureRef}
        style={{ position: 'fixed', left: '-9999px', top: 0, width: '1280px', background: '#ffffff', zIndex: -1 }}
        aria-hidden="true"
      >
        {item.slides.map((s, i) => (
          <div key={i} className="p-8">{renderSlideCard(s, i, lang)}</div>
        ))}
      </div>
    </div>
  );
}