'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useCart } from './CartProvider';
import { money } from '@/lib/format';

export function Stepper({ item }) {
  const { inc, dec } = useCart();
  return (
    <div className="stepper sm" role="group" aria-label={`${item.name} quantity`}>
      <button type="button" className="qty-btn" aria-label="Remove one" onClick={() => dec(item.id)}>−</button>
      <span>{item.qty}</span>
      <button type="button" className="qty-btn" aria-label="Add one more" onClick={() => inc(item.id)}>+</button>
    </div>
  );
}

export default function CartDrawer() {
  const { items, count, total, open, setOpen, remove, clear, toast } = useCart();
  const lastToast = useRef('');
  if (toast) lastToast.current = toast.replace(/^Added: /, '');

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', esc);
    return () => { window.removeEventListener('keydown', esc); document.body.style.overflow = ''; };
  }, [open, setOpen]);

  return (
    <>
      <div className={`add-toast${toast ? ' show' : ''}`} role="status" aria-live="polite">✓ {lastToast.current}<span> added to your order</span></div>
      <div className={`drawer-bg${open ? ' open' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`drawer${open ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label="Your order" inert={!open}>
        <div className="drawer-head">
          <h3 className="heading">Your order <span className="drawer-count">{count}</span></h3>
          <button type="button" className="popup-close" aria-label="Close order list" onClick={() => setOpen(false)}>&times;</button>
        </div>

        {items.length === 0 ? (
          <div className="drawer-empty">
            <div>🛍️</div>
            <p>Your order list is empty.<br />Tap “+ Add” on any dish to start.</p>
            <Link href="/menu" className="btn" onClick={() => setOpen(false)}>Browse the menu</Link>
          </div>
        ) : (
          <>
            <ul className="drawer-list">
              {items.map((it) => (
                <li key={it.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.img} alt="" />
                  <div className="drawer-info">
                    <strong>{it.name}</strong>
                    <span>{money(it.price)} each</span>
                    <Stepper item={it} />
                  </div>
                  <div className="drawer-line">
                    <b>{money(it.price * it.qty)}</b>
                    <button type="button" className="link-btn" onClick={() => remove(it.id)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="drawer-foot">
              <div className="drawer-total"><span>Total</span><b>{money(total)}</b></div>
              <Link href="/order" className="btn wa" onClick={() => setOpen(false)}>Checkout · {count} {count === 1 ? 'item' : 'items'}</Link>
              <button type="button" className="link-btn center" onClick={clear}>Clear order</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
