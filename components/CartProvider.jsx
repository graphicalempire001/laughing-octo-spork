'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';

const Ctx = createContext(null);
export const useCart = () => useContext(Ctx);
const KEY = 'uj-cart';

function reducer(state, a) {
  switch (a.type) {
    case 'load': return a.items;
    case 'add': {
      const found = state.find((x) => x.id === a.item.id);
      return found ? state.map((x) => (x.id === a.item.id ? { ...x, qty: x.qty + 1 } : x)) : [...state, { ...a.item, qty: 1 }];
    }
    case 'inc': return state.map((x) => (x.id === a.id ? { ...x, qty: Math.min(99, x.qty + 1) } : x));
    case 'dec': return state.map((x) => (x.id === a.id ? { ...x, qty: x.qty - 1 } : x)).filter((x) => x.qty > 0);
    case 'remove': return state.filter((x) => x.id !== a.id);
    case 'clear': return [];
    default: return state;
  }
}

export default function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, []);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [bump, setBump] = useState(0);
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
      if (Array.isArray(raw)) {
        dispatch({
          type: 'load',
          items: raw.filter((x) => x && typeof x.id === 'string' && Number(x.qty) > 0 && Number.isFinite(Number(x.price))).map((x) => ({ id: x.id, name: String(x.name), price: Number(x.price), img: String(x.img || ''), qty: Math.min(99, Number(x.qty)) })),
        });
      }
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items, ready]);

  const add = useCallback((item) => {
    dispatch({ type: 'add', item: { id: item.id, name: item.name, price: Number(item.price), img: item.img } });
    setBump((b) => b + 1);
    setToast(`Added: ${item.name}`);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 1800);
  }, []);
  const inc = useCallback((id) => { dispatch({ type: 'inc', id }); setBump((b) => b + 1); }, []);
  const dec = useCallback((id) => dispatch({ type: 'dec', id }), []);
  const remove = useCallback((id) => dispatch({ type: 'remove', id }), []);
  const clear = useCallback(() => dispatch({ type: 'clear' }), []);

  const value = useMemo(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const total = items.reduce((s, i) => s + i.qty * i.price, 0);
    return { items, count, total, open, setOpen, bump, toast, add, inc, dec, remove, clear, ready };
  }, [items, open, bump, toast, add, inc, dec, remove, clear, ready]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
