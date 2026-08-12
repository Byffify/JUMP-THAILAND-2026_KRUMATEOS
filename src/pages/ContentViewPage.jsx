/* ==========================================================================
   KruMate OS — Content view page
   Port of js/app.js renderContent (434-463) + chrome markup from index.html.
   Class names, ids, glyphs and inline styles preserved verbatim.
   ========================================================================== */
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { STORE } from '../services/store.js';
import { labelFor } from '../data/types.js';
import { useI18n } from '../context/I18nContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { renderItemBody } from '../components/ItemRenderers.jsx';
import { copyItem, downloadItem, printItem, exportAsImage } from '../utils/export.js';

export default function ContentViewPage() {
  const { id } = useParams();
  const { t } = useI18n();
  const toast = useToast();

  const [item, setItem] = useState(() => STORE.find(id));
  const [, setTick] = useState(0);
  const contentBodyRef = useRef(null);
  useEffect(() => {
    setItem(STORE.find(id));
  }, [id]);

  if (!item) {
    return (
      <section id="page-content" className="page">
        <div id="content-empty" className="text-center py-20 text-muted">
          <p>{t('content.empty')}</p>
        </div>
      </section>
    );
  }

  const onSave = () => {
    STORE.save(item);
    toast(t('content.toastSaved'), 'ok');
    setTick(n => n + 1);
  };

  const isSaved = !!STORE.itemById(item.id);

  return (
    <section id="page-content" className="page">
      <div id="content-wrap">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between mb-6">
          <div>
            <Link to="/generator" className="text-sm font-medium text-primary hover:underline">{t('content.back')}</Link>
            <h1 className="text-2xl sm:text-3xl font-semibold mt-1" id="content-title">{item.title}</h1>
            <p className="text-muted text-sm mt-1" id="content-meta">
              <span className="inline-flex items-center gap-1.5">
                <span className={'w-2 h-2 rounded-full ' + (isSaved ? 'bg-green-500' : 'bg-primary')}></span>
                {isSaved ? t('content.savedBadge') : t('content.unsaved')}
              </span>
              {' · '}
              <span className="font-medium">{t(labelFor(item.type))}</span>
              {item.grade ? ' · ' + item.grade : null}
              {item.subject ? ' · ' + item.subject : null}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              id="content-save"
              className={'btn btn-primary' + (isSaved ? ' opacity-70' : '')}
              onClick={onSave}
            >
              {isSaved ? t('content.savedBadge') : t('content.save')}
            </button>
            <button id="content-copy" className="btn btn-secondary" onClick={() => copyItem(item, toast)}>
              {t('content.copy')}
            </button>
            <button id="content-print" className="btn btn-secondary" onClick={() => printItem(item)}>
              {t('content.print')}
            </button>
            <button id="content-download" className="btn btn-secondary" onClick={() => downloadItem(item, toast)}>
              {t('content.download')}
            </button>
            <button id="content-export-image" className="btn btn-secondary" onClick={() => exportAsImage(contentBodyRef, item, toast)}>
              {t('content.exportImage') || 'Save as Image'}
            </button>
          </div>
        </div>
        <div id="content-body" ref={contentBodyRef} className="space-y-6">{renderItemBody(item)}</div>
      </div>
    </section>
  );
}