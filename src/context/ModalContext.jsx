import { createContext, useContext, useState, useCallback, useRef } from 'react';

const Ctx = createContext(null);

export function ModalProvider({ children }) {
  const [modal, setModal] = useState(null);
  const resolver = useRef(null);

  const openModal = useCallback(opts => new Promise(resolve => {
    resolver.current = resolve;
    setModal(opts);
  }), []);

  const close = useCallback(result => {
    setModal(null);
    if (resolver.current) { resolver.current(result); resolver.current = null; }
  }, []);

  return (
    <Ctx.Provider value={openModal}>
      {children}
      {modal && (
        <div id="modal-root" className="fixed inset-0 z-40 flex items-center justify-center bg-dark/40 p-4"
             onClick={e => { if (e.target === e.currentTarget) close(false); }}>
          <div id="modal-card" className="bg-white rounded-2xl shadow-lift w-full max-w-md p-6">
            <h3 className="text-xl font-semibold mb-2">{modal.title}</h3>
            <div className="text-muted text-sm mb-6">{modal.body}</div>
            <div className="flex gap-2 justify-end">
              <button className="btn btn-secondary" onClick={() => close(false)}>{modal.cancel}</button>
              <button className={'btn ' + (modal.danger ? 'btn-danger' : 'btn-primary')} autoFocus onClick={() => close(true)}>{modal.confirm}</button>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

export function useModal() { return useContext(Ctx); }
