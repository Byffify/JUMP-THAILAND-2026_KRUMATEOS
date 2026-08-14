export default function FaqItem({ entry, open, onToggle }) {
  const id = 'faq-' + entry.id;
  return (
    <div className="card mb-3 overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 text-left"
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
      >
        <span className="font-medium pr-4">{entry.question}</span>
        <span className="shrink-0 text-primary text-xl leading-none" aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div id={id} className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-muted leading-relaxed">
          {entry.answer}
        </div>
      )}
    </div>
  );
}