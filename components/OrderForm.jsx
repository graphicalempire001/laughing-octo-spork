'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from './CartProvider';
import { Stepper } from './CartDrawer';
import { site, waLink } from '@/data/site';
import { money } from '@/lib/format';

export default function OrderForm() {
  const { items, count, total, remove, clear, ready } = useCart();
  const [name, setName] = useState('');
  const [type, setType] = useState('Pickup');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);

  if (!ready) return <p className="adm-muted">Loading your order…</p>;

  if (items.length === 0)
    return (
      <div className="order-empty">
        <div>🛍️</div>
        <h3 className="heading">Your order list is empty</h3>
        <p>Pick something tasty from the menu and it will show up here.</p>
        <Link href="/menu" className="btn">Browse the menu</Link>
      </div>
    );

  const valid = name.trim().length > 1 && (type === 'Pickup' || address.trim().length > 4);
  const lines = items.map((i) => `${i.qty} x ${i.name} (${money(i.price * i.qty)})`).join('\n');
  const text =
    `Hi Ubuntu & Jollof! I'd like to place an order:\n\n${lines}\n\nTotal: ${money(total)}\n` +
    `Order type: ${type}\nName: ${name.trim()}\n` +
    (type === 'Delivery' ? `Delivery address: ${address.trim()}\n` : '') +
    (notes.trim() ? `Notes: ${notes.trim()}\n` : '') +
    (type === 'Delivery' ? '\nPlease confirm the delivery fee and time.' : '\nPlease confirm when it will be ready.');

  return (
    <div className="order-grid">
      <section className="adm-card order-list" aria-label="Items in your order">
        <h2 className="heading">Your items <span className="drawer-count">{count}</span></h2>
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
        <div className="drawer-total big"><span>Total</span><b>{money(total)}</b></div>
        <p className="adm-muted adm-small">Delivery fees, if any, are confirmed by us on WhatsApp. Pay when you receive your food.</p>
        <Link href="/menu" className="link-btn">+ Add more dishes</Link>
      </section>

      <section className="adm-card order-form" aria-label="Your details">
        <h2 className="heading">Your details</h2>
        <label className="adm-label">Your name
          <input className="adm-input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="e.g. Thandi" />
        </label>
        <div className="adm-label">How would you like it?
          <div className="chips">
            {['Pickup', 'Delivery'].map((t) => (
              <label key={t} className={`chip${type === t ? ' on' : ''}`}>
                <input type="radio" name="type" value={t} checked={type === t} onChange={() => setType(t)} hidden />
                {t === 'Pickup' ? '🏪 Pickup' : '🛵 Delivery'}
              </label>
            ))}
          </div>
        </div>
        {type === 'Delivery' && (
          <label className="adm-label">Delivery address
            <textarea className="adm-input" rows={2} value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="street-address" placeholder="Street, suburb, landmark" />
          </label>
        )}
        <label className="adm-label">Notes (optional)
          <textarea className="adm-input" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Allergies, spice level, extra sauce…" />
        </label>
        {touched && !valid && <p className="form-error">Please add your name{type === 'Delivery' ? ' and delivery address' : ''}.</p>}

        <a
          className="btn wa send-btn"
          href={valid ? waLink(text) : '#'}
          target={valid ? '_blank' : undefined}
          rel="noopener noreferrer"
          onClick={(e) => {
            if (!valid) { e.preventDefault(); setTouched(true); return; }
            setSent(true);
            // best-effort copy of the order for the shop's records (never blocks WhatsApp)
            try {
              fetch('/api/orders', { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name.trim(), mode: type, address: address.trim(), notes: notes.trim(), items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })) }) }).catch(() => {});
            } catch {}
          }}
        >
          💬 Send order on WhatsApp · {money(total)}
        </a>
        <a className="btn white" href={`tel:${site.phoneTel}`}>📞 Or call {site.phoneDisplay}</a>

        {sent && (
          <div className="sent-note" role="status">
            <strong>WhatsApp opened with your order.</strong> Press send there and we’ll confirm it.
            <button type="button" className="link-btn" onClick={() => { clear(); setSent(false); }}>Order sent? Clear this list</button>
          </div>
        )}
      </section>
    </div>
  );
}
