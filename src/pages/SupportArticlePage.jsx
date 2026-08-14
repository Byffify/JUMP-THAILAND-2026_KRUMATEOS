import { Link, useParams } from 'react-router-dom';
import { useI18n } from '../context/I18nContext.jsx';
import { getGuideById } from '../data/support.js';
import GuideArticle from '../components/support/GuideArticle.jsx';

export default function SupportArticlePage() {
  const { t, lang } = useI18n();
  const { id } = useParams();
  const topic = getGuideById(lang, id);

  if (!topic) {
    return (
      <section id="page-support" className="page">
        <div className="card p-8 text-center">
          <p className="text-muted mb-4">{t('support.notFound')}</p>
          <Link to="/support" className="btn btn-secondary">{t('support.back')}</Link>
        </div>
      </section>
    );
  }

  return (
    <section id="page-support" className="page">
      <div className="mb-4">
        <Link to="/support" className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary">
          <span aria-hidden="true">←</span> {t('support.back')}
        </Link>
      </div>
      <GuideArticle topic={topic} />
    </section>
  );
}