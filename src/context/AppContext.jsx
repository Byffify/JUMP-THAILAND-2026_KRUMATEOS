import { createContext, useContext, useState, useCallback } from 'react';
import { STORE } from '../services/store.js';

const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => STORE.getUser());
  const [libQuery, setLibQuery] = useState(undefined);

  const login = useCallback((name, subject) => {
    const u = { name, subject, initial: name.charAt(0).toUpperCase() };
    setUser(u);
    STORE.setUser(u);
  }, []);

  const logout = useCallback(() => {
    STORE.setUser(null);
    setUser(null);
  }, []);

  return (
    <Ctx.Provider value={{ user, login, logout, libQuery, setLibQuery }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp() { return useContext(Ctx); }
