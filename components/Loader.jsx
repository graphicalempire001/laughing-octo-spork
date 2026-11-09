'use client';
import { useEffect, useRef, useState } from 'react';

// Branded loader. Instead of a progress bar, warm aromatic steam rises off the logo.
// The steam ADAPTS: it thickens as the page really loads (readyState + resources fetched),
// scales to the device (fewer wisps on weak phones / data saver), and gives a final puff when ready.
export default function Loader() {
  const [hide, setHide] = useState(false);
  const [gone, setGone] = useState(false);
  const cv = useRef(null);
  const [typed, setTyped] = useState('');

  // typing animation: types a line, holds, erases, types the next
  useEffect(() => {
    const lines = ['Something special is cooking…', 'Jollof on the fire…', 'Almost ready to serve…'];
    let li = 0, ci = 0, dir = 1, t;
    const step = () => {
      const line = lines[li];
      ci += dir; setTyped(line.slice(0, ci));
      let d = dir === 1 ? 55 : 22;
      if (dir === 1 && ci === line.length) { dir = -1; d = 1100; }
      else if (dir === -1 && ci === 0) { dir = 1; li = (li + 1) % lines.length; d = 250; }
      t = setTimeout(step, d);
    };
    t = setTimeout(step, 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const start = performance.now();
    let done = false, raf = 0, stopped = false;
    const finish = () => {
      if (done) return;
      done = true;
      const wait = Math.max(0, 2100 - (performance.now() - start));
      setTimeout(() => { target = 1.4; setTimeout(() => { setHide(true); setTimeout(() => { stopped = true; setGone(true); }, 800); }, 350); }, wait);
    };
    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish, { once: true });
    const cap = setTimeout(finish, 3500);

    // ---- adaptive steam ----
    const c = cv.current; const ctx = c.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const weak = (navigator.hardwareConcurrency || 4) <= 4 || (navigator.deviceMemory || 4) <= 2 || (navigator.connection || {}).saveData;
    const dpr = Math.min(window.devicePixelRatio || 1, weak ? 1 : 1.5);
    const W = 360, H = 300;
    c.width = W * dpr; c.height = H * dpr; ctx.scale(dpr, dpr);
    const maxN = reduce ? 8 : weak ? 16 : 32;

    // pre-rendered soft puff sprites (warm cream -> golden), so each frame is only drawImage
    const sprite = (rgb) => { const s = document.createElement('canvas'); s.width = s.height = 64; const g = s.getContext('2d');
      const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, `rgba(${rgb},.9)`); r.addColorStop(.5, `rgba(${rgb},.35)`); r.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = r; g.fillRect(0, 0, 64, 64); return s; };
    const sprites = [sprite('255,255,255'), sprite('255,255,255'), sprite('250,252,255')];

    let progress = 0, target = 0.15; // 0..1 (1.4 = final puff)
    const parts = [];
    const spawn = () => ({ x: W / 2 + (Math.random() - .5) * 120, y: H - 30 + Math.random() * 10, r: 14 + Math.random() * 16, vy: .45 + Math.random() * .55, ph: Math.random() * 6.28, sw: 10 + Math.random() * 18, life: 0, ttl: 110 + Math.random() * 70, s: sprites[(Math.random() * 3) | 0] });

    const readTarget = () => {
      if (done) return;
      const rs = document.readyState;
      const base = rs === 'complete' ? 1 : rs === 'interactive' ? .6 : .25;
      const res = performance.getEntriesByType('resource');
      const fetched = res.filter((e) => e.responseEnd > 0).length;
      const byRes = Math.min(.9, fetched / 14);
      target = Math.max(base, byRes * .8, Math.min(.9, (performance.now() - start) / 3200));
    };
    const poll = setInterval(readTarget, 200);

    let last = performance.now();
    const tick = (now) => {
      if (stopped) return;
      const dt = Math.min(2.2, (now - last) / 16.7); last = now;
      progress += (target - progress) * 0.04 * dt;
      ctx.clearRect(0, 0, W, H);
      const want = Math.round(maxN * Math.min(1, .2 + progress * .85)); // more steam as more is loaded
      if (parts.length < want && (!reduce || Math.random() < .2) && Math.random() < .5 + progress * .4) parts.push(spawn());
      for (let i = parts.length - 1; i >= 0; i--) {
        const q = parts[i]; q.life += dt;
        const t = q.life / q.ttl;
        if (t >= 1) { parts.splice(i, 1); continue; }
        q.y -= q.vy * dt * (1 + progress * .5);
        const x = q.x + Math.sin(q.ph + q.life * .035) * q.sw * t * 2;
        const size = q.r * (1 + t * 2.6);
        ctx.globalAlpha = Math.sin(Math.PI * t) * (.75 + Math.min(progress, 1) * .25);
        ctx.drawImage(q.s, x - size, q.y - size, size * 2, size * 2);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => { clearTimeout(cap); clearInterval(poll); cancelAnimationFrame(raf); window.removeEventListener('load', finish); };
  }, []);

  if (gone) return null;
  return (
    <div className={`loader${hide ? ' hide' : ''}`} role="status" aria-label="Loading Ubuntu & Jollof">
      <div className="loader-box">
        <canvas ref={cv} className="loader-steam-cv" aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="loader-logo" src="/brand/logo.webp" alt="Ubuntu & Jollof" width="240" height="186" fetchPriority="high" />
        <p className="loader-type" aria-live="polite">{typed}<span className="caret" aria-hidden="true" /></p>
      </div>
    </div>
  );
}
