import { useRef, useState } from 'react';
import { useI18n } from '../context/I18nContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function AuthView() {
  const { t } = useI18n();
  const toast = useToast();
  const { login } = useApp();
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('Science');
  const nameRef = useRef(null);

  const doLogin = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast(t('login.desc'), 'error');
      nameRef.current && nameRef.current.focus();
      return;
    }
    login(trimmed, subject);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-card border border-line p-8">
          <div className="flex items-center gap-3 mb-6">
            <img src="/assets/logo.svg" alt="KruMate" className="w-11 h-11" />
            <div>
              <p className="font-semibold text-lg leading-tight">KruMate&nbsp;OS</p>
              <p className="text-muted text-sm">{t('login.subtitle')}</p>
            </div>
          </div>
          <h1 className="text-2xl font-semibold mb-1">{t('login.title')}</h1>
          <p className="text-muted text-sm mb-6">{t('login.desc')}</p>
          <label className="block text-sm font-medium mb-1">{t('login.nameLabel')}</label>
          <input
            id="login-name"
            ref={nameRef}
            type="text"
            className="input mb-4"
            placeholder={t('login.namePh')}
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') doLogin(); }}
          />
          <label className="block text-sm font-medium mb-1">{t('login.subjectLabel')}</label>
          <select
            id="login-subject"
            className="input mb-6"
            value={subject}
            onChange={e => setSubject(e.target.value)}
          >
            <option value="Science">{t('login.subjectScience')}</option>
            <option value="Mathematics">{t('login.subjectMath')}</option>
            <option value="Thai">{t('login.subjectThai')}</option>
            <option value="English">{t('login.subjectEnglish')}</option>
            <option value="Social Studies">{t('login.subjectSocial')}</option>
            <option value="Other">{t('login.subjectOther')}</option>
          </select>
          <button id="login-submit" className="btn btn-primary w-full py-3" onClick={doLogin}>
            {t('login.cta')}
          </button>
        </div>
      </div>
    </div>
  );
}
