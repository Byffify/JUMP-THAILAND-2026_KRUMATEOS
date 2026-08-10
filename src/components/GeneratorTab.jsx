import { assetFor, labelFor } from '../data/types.js';
import { useI18n } from '../context/I18nContext.jsx';

export default function GeneratorTab({ type, index, selected, onClick, dataType, tabIndex, role, ariaSelected }) {
  const { t } = useI18n();
  const label = t(labelFor(type));
  const base = {
    onClick,
    style: { '--i': index },
    className: 'generator-tab' + (selected ? ' active' : ''),
    'aria-label': label,
    title: label,
  };
  if (dataType !== undefined) base['data-type'] = dataType;
  if (tabIndex !== undefined) base.tabIndex = tabIndex;
  if (role !== undefined) base.role = role;
  if (ariaSelected !== undefined) base['aria-selected'] = ariaSelected;
  return (
    <button {...base}>
      <img className="gen-icon" src={assetFor(type)} alt="" loading="lazy" />
      <span className="gen-label">{label}</span>
      <span className="gen-underline"></span>
    </button>
  );
}