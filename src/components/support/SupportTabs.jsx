export default function SupportTabs({ tabs, active, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-6" role="tablist" aria-label="Support sections">
      {tabs.map(tab => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          className={'chip' + (active === tab.id ? ' chip-active' : '')}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}