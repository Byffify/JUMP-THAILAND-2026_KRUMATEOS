import { useEffect, useRef } from 'react';

export function useEntranceAnimation(delay = 600) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove('qc-animated');
    const timer = setTimeout(() => el.classList.add('qc-animated'), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return ref;
}