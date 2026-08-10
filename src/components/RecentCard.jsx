import { assetFor, labelFor } from '../data/types.js';
import { fmtDateTime } from '../utils/format.js';
import { useI18n } from '../context/I18nContext.jsx';

export default function RecentCard({ item, onClick }) {
  const { t } = useI18n();
  return (
    <button type="button"
      className="card card-hover w-full text-left p-4 flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      onClick={onClick}>
      <img src={assetFor(item.type)} alt="" className="w-14 h-11 rounded-lg object-contain bg-soft/40 border border-line shrink-0" />
      <span className="flex-1 min-w-0">
        <span className="block font-medium truncate">{item.title}</span>
        <span className="block text-xs text-muted">{t(labelFor(item.type))} · {fmtDateTime(item.updatedAt || item.createdAt)}</span>
      </span>
      <span className="text-muted">→</span>
    </button>
  );
}