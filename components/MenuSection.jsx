'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import AddButton from './AddButton';
import Reveal from './Reveal';
import { money } from '@/lib/format';

export default function MenuSection({ items, initialCat = 'All', limit = 0 }) {
  const cats = useMemo(() => ['All', ...new Set(items.map((i) => i.category).filter(Boolean))], [items]);
  const [cat, setCat] = useState(cats.includes(initialCat) ? initialCat : 'All');
  let shown = cat === 'All' ? items : items.filter((i) => i.category === cat);
  const more = limit > 0 && cat === 'All' && shown.length > limit;
  if (limit > 0 && cat === 'All') shown = shown.slice(0, limit);

  return (
    <>
      <div className="tabs" role="tablist" aria-label="Menu categories">
        {cats.map((c) => (
          <button key={c} role="tab" aria-selected={c === cat} className={`btn sm ${c === cat ? 'on' : 'white'}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      <div className="menu-grid">
        {shown.length === 0 && <p className="empty">No dishes here yet. Check back soon.</p>}
        {shown.map((m, i) => (
          <Reveal key={m.id} delay={(i % 4) * 0.08}>
            <article className="card">
              {m.tag && <span className="tag">{m.tag}</span>}
              <div className="card-thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.img} alt={m.name} loading="lazy" />
              </div>
              <div className="card-body">
                <div className="card-cat">{m.category}</div>
                <h3>{m.name}</h3>
                <p>{m.description}</p>
                <div className="card-foot">
                  <span className="price">{money(m.price)}</span>
                  <AddButton item={{ id: m.id, name: m.name, price: m.price, img: m.img }} />
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      {more && (
        <div className="center-row">
          <Link href="/menu" className="btn">See the full menu</Link>
        </div>
      )}
    </>
  );
}
