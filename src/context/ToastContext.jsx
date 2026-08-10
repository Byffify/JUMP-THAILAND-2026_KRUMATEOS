import { createContext, useContext, useState, useCallback } from 'react';

const Ctx = createContext(null);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const toast = useCallback((msg, kind) => {
    const id = Math.random().toString(36).slice(2);
    setItems(list => [...list, { id, msg, kind }]);
    setTimeout(() => setItems(list => list.filter(i => i.id !== id)), 2600);
  }, []);
  return (
    <Ctx.Provider value={toast}>
      {children}
      <div id="toast-root" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 space-y-2 pointer-events-none">
        {items.map(it => (
          <div key={it.id} role="status"
               className={'toast ' + (it.kind === 'error' ? 'toast-err' : it.kind === 'ok' ? 'toast-ok' : '')}>
            <span dangerouslySetInnerHTML={{ __html: it.msg }} />
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() { return useContext(Ctx); }
