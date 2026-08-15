/* ==========================================================================
   KruMate OS — ItemRenderers
   JSX port of js/app.js renderItemBody (465-612). Class names, ids, inline
   styles and interpolations preserved verbatim.
   ========================================================================== */

export function loc(v, lang) {
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    return v[lang] || v.en || v.th || '';
  }
  return v == null ? '' : v;
}

export function renderLesson(item) {
  return (
    <div className="card p-6">
      <h2 className="font-semibold text-lg mb-1">{item.title}</h2>
      <p className="text-sm text-muted mb-5">
        {item.grade || ''}{item.grade && item.subject ? ' · ' : ' '}{item.subject || ''}
      </p>
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-primary mb-2">Objectives</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {item.objectives.map((o, i) => <li key={i}>{o}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-primary mb-2">Materials</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {item.materials.map((o, i) => <li key={i}>{o}</li>)}
          </ul>
        </div>
      </div>
      <h3 className="font-semibold text-primary mt-6 mb-2">Lesson Procedure</h3>
      <ol className="space-y-2">
        {item.procedure.map((p, i) => (
          <li key={i} className="flex gap-3 p-3 rounded-xl bg-soft/60">
            <span className="shrink-0 w-24 text-xs font-semibold text-dark mt-0.5 uppercase">
              {p.phase} <span className="block font-normal text-muted normal-case">{p.time}</span>
            </span>
            <span className="text-sm">{p.detail}</span>
          </li>
        ))}
      </ol>
      <h3 className="font-semibold text-primary mt-6 mb-2">Assessment</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        {item.assessment.map((a, i) => <li key={i}>{a}</li>)}
      </ul>
    </div>
  );
}

export function renderWorksheet(item) {
  return (
    <div className="card p-6">
      <h2 className="font-semibold text-lg mb-1">{item.title}</h2>
      <p className="text-sm text-muted mb-4">
        {item.grade || ''}{item.grade && item.subject ? ' · ' : ' '}{item.subject || ''}
      </p>
      <div className="rounded-xl bg-peach/40 p-4 text-sm mb-6">
        <strong>Instructions:</strong> {item.instructions}
      </div>
      {item.sections.map((s, si) => (
        <div key={si} className="mb-6">
          <h3 className="font-semibold text-primary mb-3">{s.heading}</h3>
          <ol className="space-y-3">
            {s.tasks.map((task, ti) => (
              <li key={ti} className="border-b border-dashed border-line pb-3 text-sm">
                <span className="inline-block w-6 h-6 rounded-md bg-soft text-xs font-semibold items-center justify-center flex mr-2 align-middle">
                  {s.tasks.indexOf(task) + 1}
                </span>{task}
                <div className="h-10 mt-2 ml-8"></div>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

export function renderQuiz(item) {
  return (
    <div className="card p-6">
      <h2 className="font-semibold text-lg mb-1">{item.title}</h2>
      <p className="text-sm text-muted mb-5">
        {item.grade || ''} · {item.subject || ''} · {item.count} questions
      </p>
      <ol className="space-y-4">
        {item.questions.map((q, i) => {
          const num = i + 1;
          if (q.kind === 'mc') return (
            <li key={i} className="p-4 rounded-xl bg-soft/60">
              <p className="text-sm font-medium mb-2">{num}. {q.question}</p>
              <div className="grid sm:grid-cols-2 gap-1.5 pl-1">
                {q.options.map((o, oi) => (
                  <label key={oi} className="flex items-start gap-2 p-2.5 rounded-lg bg-white border border-line text-sm cursor-pointer hover:border-primary">
                    <input type="radio" name={'q' + num} className="mt-1 w-4 h-4 text-primary accent-primary" />
                    <span><strong>{String.fromCharCode(65 + oi)}.</strong> {o}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted mt-2 pt-2 border-t border-line">{q.answer}</p>
            </li>
          );
          if (q.kind === 'tf') return (
            <li key={i} className="p-4 rounded-xl bg-soft/60">
              <label className="flex items-center gap-3 text-sm">
                <input type="checkbox" className="w-4 h-4 text-primary rounded accent-primary" />
                <span>{num}. {q.question}</span>
              </label>
              <p className="text-xs text-muted mt-2 pt-2 border-t border-line">{q.answer}</p>
            </li>
          );
          return (
            <li key={i} className="p-4 rounded-xl bg-soft/60">
              <p className="text-sm font-medium mb-2">{num}. {q.question}</p>
              <div className="h-16 bg-white border border-line rounded-lg"></div>
              <p className="text-xs text-muted mt-2 pt-2 border-t border-line">{q.answer}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function renderRubric(item) {
  return (
    <div className="card p-6 overflow-x-auto">
      <h2 className="font-semibold text-lg mb-1">{item.title}</h2>
      <p className="text-sm text-muted mb-5">
        {item.grade || ''}{item.grade && item.subject ? ' · ' : ' '}{item.subject || ''}
      </p>
      <table className="w-full text-sm border-collapse min-w-[520px]">
        <thead>
          <tr className="bg-soft">
            <th className="text-left p-3 border border-line rounded-l-lg">Criteria</th>
            {item.scale.map((s, i) => (
              <th key={i} className="text-left p-3 border border-line text-xs font-semibold">{s}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {item.criteria.map((c, i) => (
            <tr key={i}>
              <td className="p-3 border border-line font-medium">{c.name}</td>
              {c.rows.map((r, j) => (
                <td key={j} className="p-3 border border-line text-muted">{r}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function renderActivity(item) {
  return (
    <div className="card p-6">
      <h2 className="font-semibold text-lg mb-1">{item.title}</h2>
      <p className="text-sm text-muted mb-5">
        {item.grade || ''}{item.grade && item.subject ? ' · ' : ' '}{item.subject || ''}
      </p>
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl bg-soft p-4 text-sm">
          <span className="block font-semibold">{item.time}</span>
          <span className="text-muted">Duration</span>
        </div>
        <div className="rounded-xl bg-soft p-4 text-sm">
          <span className="block font-semibold">{item.groupSize}</span>
          <span className="text-muted">Grouping</span>
        </div>
        <div className="rounded-xl bg-soft p-4 text-sm">
          <span className="block font-semibold">Objective</span>
          <span className="text-muted block">{item.objective}</span>
        </div>
      </div>
      <h3 className="font-semibold text-primary mb-2">Materials</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm mb-6">
        {item.materials.map((m, i) => <li key={i}>{m}</li>)}
      </ul>
      <h3 className="font-semibold text-primary mb-2">Steps</h3>
      <ol className="space-y-2 mb-6">
        {item.steps.map((s, i) => (
          <li key={i} className="flex gap-3 p-3 rounded-xl bg-soft/60">
            <span className="shrink-0 w-16 text-xs font-semibold text-dark mt-0.5">{s.time}</span>
            <span className="text-sm">{s.detail}</span>
          </li>
        ))}
      </ol>
      <h3 className="font-semibold text-primary mb-2">Discussion questions</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        {item.discussion.map((d, i) => <li key={i}>{d}</li>)}
      </ul>
    </div>
  );
}

export function renderSlideCard(s, i, lang) {
  const dark = i % 2 === 1;
  return (
    <div
      key={i}
      className={
        'relative aspect-video rounded-3xl overflow-hidden p-8 sm:p-12 flex flex-col justify-between ' +
        (dark
          ? 'bg-gradient-to-br from-dark via-[#3A1A08] to-[#2F0F03] text-white'
          : 'bg-gradient-to-br from-cream via-[#FFF6EA] to-peach/50 border border-line')
      }
    >
      <div className="flex items-center justify-between">
        <span className={'text-xs font-semibold ' + (dark ? 'text-white/50' : 'text-muted')}>
          {String(i + 1).padStart(2, '0')}
        </span>
        <span className={'w-10 h-10 ' + (dark ? 'bg-primary/25' : 'bg-primary/15') + ' rounded-xl'}></span>
      </div>
      <div className="max-w-3xl">
        {s.subtitle && (
          <p className="text-xs sm:text-sm mb-2 font-medium text-primary">{loc(s.subtitle, lang)}</p>
        )}
        <h3 className="font-semibold text-2xl sm:text-4xl leading-snug mb-4">{loc(s.title, lang)}</h3>
        {s.bullets.length > 0 && (
          <ul className={'space-y-2 sm:space-y-3 text-sm sm:text-lg ' + (dark ? 'text-white/85' : 'text-muted')}>
            {s.bullets.map((b, j) => (
              <li key={j} className="flex gap-3">
                <span className="text-primary shrink-0">•</span>
                <span>{loc(b, lang)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function renderSlides(item, lang) {
  return (
    <>
      <div className="card p-6">
        <h2 className="font-semibold text-lg mb-1">{loc(item.title, lang)}</h2>
        <p className="text-sm text-muted mb-5">
          {loc(item.grade, lang) || ''} · {item.subject || ''} · {item.slides.length} slides
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {item.slides.map((s, i) => (
          <div key={i} className={'aspect-[4/3] rounded-2xl p-6 flex flex-col justify-between ' + (i % 2 ? 'bg-dark text-white' : 'bg-white border border-line') + ' overflow-hidden'}>
            <div className="flex items-center justify-between">
              <span className={'text-xs font-semibold ' + (i % 2 ? 'text-white/60' : 'text-muted')}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={'w-8 h-8 ' + (i % 2 ? 'bg-primary/20' : 'bg-peach/60') + ' rounded-lg'}></span>
            </div>
            <div>
              {s.subtitle && (
                <p className="text-xs mb-2 text-primary">{loc(s.subtitle, lang)}</p>
              )}
              <h3 className="font-semibold text-xl leading-snug mb-3">{loc(s.title, lang)}</h3>
              {s.bullets.length > 0 && (
                <ul className="space-y-1.5 text-sm opacity-90">
                  {s.bullets.map((b, j) => (
                    <li key={j} className="flex gap-2">
                      <span className="text-primary">•</span> {loc(b, lang)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function renderItemBody(item, lang) {
  switch (item.type) {
    case 'lesson': return renderLesson(item);
    case 'worksheet': return renderWorksheet(item);
    case 'quiz': return renderQuiz(item);
    case 'rubric': return renderRubric(item);
    case 'activity': return renderActivity(item);
    default: return renderSlides(item, lang);
  }
}