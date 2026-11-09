'use client';
import Link from 'next/link';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { slides } from '@/data/site';

const DELAY = 7000;

export default function Hero() {
  const [cur, setCur] = useState(0);
  const root = useRef(null);
  const timer = useRef(null);
  const paused = useRef(false);
  const touchX = useRef(0);

  const go = useCallback((i) => setCur((i + slides.length) % slides.length), []);

  useEffect(() => {
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      if (!paused.current) setCur((c) => (c + 1) % slides.length);
    }, DELAY);
    return () => clearInterval(timer.current);
  }, [cur]);

  // The hero stays put while the next card climbs over it; --p (0..1) dims and nudges it as it gets covered.
  useEffect(() => {
    const el = root.current;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const p = Math.min(1, Math.max(0, window.scrollY / (el.offsetHeight || 1)));
        el.style.setProperty('--p', p.toFixed(3));
      });
    };
    window.addEventListener('scroll', on, { passive: true });
    on();
    return () => { window.removeEventListener('scroll', on); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section
      className="hero"
      id="home"
      ref={root}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1));
      }}
    >
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`slide${i === cur ? ' active' : ''}`}
          aria-hidden={i !== cur}
          style={{ '--px': s.pan[0], '--py': s.pan[1], '--z0': s.z[0], '--z1': s.z[1] }}
        >
          <div className="slide-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="slide-img" src={s.img} alt={`${s.title} at Ubuntu & Jollof`} loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : 'auto'} />
            <div className="slide-shade" />
          </div>
          <div className="slide-inner">
            <div className="slide-contents">
              <div className="kicker">{s.kicker}</div>
              <h2>
                {s.title.split(' ').map((w, k) => (
                  <Fragment key={k}>
                    {k > 0 && ' '}
                    <span className="w"><span style={{ '--i': k }}>{w}</span></span>
                  </Fragment>
                ))}
              </h2>
              <p>{s.text}</p>
              <div className="cta-wrap">
                <Link href={`/menu?cat=${encodeURIComponent(s.cat)}`} className="btn" tabIndex={i === cur ? 0 : -1}>{s.cta}</Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button className="s-arrow s-prev" aria-label="Previous slide" onClick={() => go(cur - 1)}>&#8249;</button>
      <button className="s-arrow s-next" aria-label="Next slide" onClick={() => go(cur + 1)}>&#8250;</button>
      <div className="s-dots">
        {slides.map((s, i) => (
          <button key={s.id} className={i === cur ? 'active' : ''} aria-label={`Show ${s.title}`} data-nofx onClick={() => go(i)} />
        ))}
      </div>
    </section>
  );
}
