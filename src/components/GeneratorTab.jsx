import { assetFor, labelFor } from '../data/types.js';
import { useI18n } from '../context/I18nContext.jsx';

export default function GeneratorTab({ type, index, selected, onClick }) {
  const { t } = useI18n();
  const label = t(labelFor(type));
  return (
    <button
      onClick={onClick}
      style={{ '--i': index }}
      className={'generator-tab' + (selected ? ' active' : '')}
      aria-label={label}
      title={label}
    >
      <img className="gen-icon" src={assetFor(type)} alt="" loading="lazy" />
      <span className="gen-label">{label}</span>
      <span className="gen-underline"></span>
    </button>
  );
}