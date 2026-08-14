export default function GuideArticle({ topic, onClose }) {
  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          {topic.icon && <img src={topic.icon} alt="" className="w-12 h-12 object-contain shrink-0" />}
          <h1 className="text-xl sm:text-2xl font-semibold">{topic.title}</h1>
        </div>
        {onClose && (
          <button type="button" className="btn btn-ghost px-2.5 text-sm" onClick={onClose}>✕</button>
        )}
      </div>
      <p className="text-muted text-sm mb-4">{topic.summary}</p>
      <ol className="space-y-5">
        {topic.steps.map((step, i) => (
          <li key={i} className="flex gap-4">
            <span className="w-8 h-8 shrink-0 rounded-full bg-primary text-dark font-semibold flex items-center justify-center">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <h4 className="font-medium mb-1">{step.title}</h4>
              <p className="text-sm text-muted">{step.text}</p>
              {step.screenshot && (
                <img
                  src={step.screenshot.src}
                  alt={step.screenshot.alt}
                  loading="lazy"
                  className="mt-3 rounded-xl border border-line bg-soft w-full max-w-md h-40 object-cover placeholder"
                  onError={e => { e.currentTarget.classList.add('img-placeholder'); e.currentTarget.onerror = null; }}
                />
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}