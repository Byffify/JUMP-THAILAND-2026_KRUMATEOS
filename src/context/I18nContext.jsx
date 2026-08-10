import { createContext, useContext, useState, useCallback } from 'react';
import { getLang, setLang as serviceSetLang, t as i18nT } from '../services/i18n.js';

const Ctx = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(getLang());
  const setLangL = useCallback(next => {
    setLangState(serviceSetLang(next));
  }, []);
  const value = { lang, setLangL, t: i18nT };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
