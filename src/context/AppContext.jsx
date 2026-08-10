import { createContext, useContext, useState, useCallback } from 'react';
import { STORE } from '../services/store.js';

const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => STORE.getUser());
  const [libQuery, setLibQuery] = useState(undefined);
  const [pendingPrompt, setPendingPrompt] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState(() => new Set());
  const [quizKinds, setQuizKinds] = useState(() => ['mc', 'tf', 'sa']);
  const [quizCount, setQuizCount] = useState(10);

  const login = useCallback((name, subject) => {
    const u = { name, subject, initial: name.charAt(0).toUpperCase() };
    setUser(u);
    STORE.setUser(u);
  }, []);

  const logout = useCallback(() => {
    STORE.setUser(null);
    setUser(null);
  }, []);

  const toggleType = useCallback(t => {
    setSelectedTypes(prev => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  }, []);

  return (
    <Ctx.Provider value={{
      user, login, logout,
      libQuery, setLibQuery,
      pendingPrompt, setPendingPrompt,
      selectedTypes, setSelectedTypes, toggleType,
      quizKinds, setQuizKinds,
      quizCount, setQuizCount,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp() { return useContext(Ctx); }
