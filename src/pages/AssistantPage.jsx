/* ==========================================================================
   KruMate OS — AI Assistant page
   Port of js/app.js renderAssistant / sendChat / addChatMsg / bubbleAI
   (799-852) + chrome markup from index.html (645-702).
   Class names, ids (#chat-body, #chat-form, #chat-input), glyphs and markup
   structure preserved verbatim. Chat history is NOT persisted.
   ========================================================================== */
import { useEffect, useRef, useState } from 'react';
import { API } from '../services/api.js';
import { useI18n } from '../context/I18nContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const SUGGESTIONS = th => [
  th ? 'แนะนำหัวข้อบทเรียนวิทยาศาสตร์ ป.6' : 'Suggest a Grade 6 science topic',
  th ? 'ช่วยสร้างคำถามปรนัยเกี่ยวกับประวัติศาสตร์ไทย' : 'Make multiple-choice questions about Thai history',
  th ? 'กิจกรรม 10 นาทีสำหรับคาบเรียนสุดท้าย' : 'A 10-minute activity for the last period'
];

export default function AssistantPage() {
  const { t, lang } = useI18n();
  const toast = useToast();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const sending = useRef(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    setMessages([{ who: 'ai', text: t('asst.welcome'), typing: false }]);
  }, [t]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages]);

  const sendChat = async raw => {
    const msg = String(raw ?? input).trim();
    if (!msg || sending.current) return;

    sending.current = true;
    setInput('');
    setMessages(prev => [
      ...prev,
      { who: 'user', text: msg, typing: false },
      { who: 'ai', text: '', typing: true }
    ]);

    const reply = await API.assistant(msg, lang);
    sending.current = false;
    setMessages(prev => [
      ...prev.slice(0, -1),
      { who: 'ai', text: reply, typing: false }
    ]);
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  };

  return (
    <section id="page-assistant" className="page">
      <div
        className="flex flex-col lg:flex-row gap-8"
        style={{ minHeight: 'calc(100vh - 14rem)' }}
      >
        <div
          className="lg:w-2/3 flex flex-col rounded-2xl bg-white border border-line shadow-card overflow-hidden"
        >
          <div
            className="px-5 py-4 border-b border-line flex items-center gap-3"
          >
            <img
              src="/assets/assistant.svg"
              alt=""
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div>
              <p className="font-medium leading-tight">{t('asst.title')}</p>
              <p className="text-xs text-muted">{t('asst.status')}</p>
            </div>
          </div>
          <div
            id="chat-body"
            ref={bodyRef}
            className="flex-1 px-5 py-6 space-y-4 overflow-y-auto"
            style={{ height: '420px' }}
          >
            {messages.map((m, i) => (
              <div key={i} className={'msg ' + m.who + (m.typing ? ' typing' : '')}>
                {m.typing ? (
                  <>
                    <div className="bubble">
                      <span className="dot"></span><span className="dot"></span><span className="dot"></span>
                    </div>
                    <small className="meta">KruMate</small>
                  </>
                ) : (
                  <>
                    <div className="bubble">{m.text}</div>
                    <small className="meta">{m.who === 'user' ? 'You' : 'KruMate'}</small>
                  </>
                )}
              </div>
            ))}
          </div>
          <form
            id="chat-form"
            className="flex gap-2 p-4 border-t border-line"
            onSubmit={e => { e.preventDefault(); sendChat(input); }}
          >
            <input
              id="chat-input"
              type="text"
              className="input flex-1"
              placeholder={t('asst.placeholder')}
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button className="btn btn-primary px-6" type="submit">
              {t('asst.send')}
            </button>
          </form>
        </div>
        <aside className="lg:w-1/3 space-y-4">
          <div
            className="rounded-2xl bg-white border border-line shadow-card p-5"
          >
            <p className="font-medium mb-3">{t('asst.suggestTitle')}</p>
            <div className="space-y-2" id="asst-suggestions">
              {SUGGESTIONS(lang === 'th').map(s => (
                <button
                  key={s}
                  className="chip w-full justify-start text-left"
                  data-suggestion={s}
                  onClick={() => { setInput(s); sendChat(s); }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-peach/40 border border-peach p-5">
            <p className="text-sm">{t('asst.tip')}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}