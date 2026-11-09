'use client';
import { useEffect, useRef, useState } from 'react';

// Every tappable control gets: pressed-in look on pointer down, pop-out on release, a light steam puff,
// a soft "shhh" sound, and the real action is held back ~240ms so the user sees the feedback first.
const SEL = '.btn,.add-btn,.icon-btn,.s-arrow,.to-top,.order-menu>button,.nav-link,.dropdown a,.mobile-nav a,.popup-close,.socials a,.foot-links a';
const DELAY = 240;

let ctx = null;
let noise = null;
function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}
function shhh() {
  const c = audio();
  if (!c) return;
  if (!noise) {
    noise = c.createBuffer(1, Math.floor(c.sampleRate * 0.8), c.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const t = c.currentTime;
  const src = c.createBufferSource();
  src.buffer = noise;
  const band = c.createBiquadFilter();
  band.type = 'bandpass';
  band.Q.value = 0.7;
  band.frequency.setValueAtTime(2600, t);
  band.frequency.exponentialRampToValueAtTime(5600, t + 0.5);
  const hp = c.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 1400;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(0.2, t + 0.06);
  g.gain.exponentialRampToValueAtTime(0.0008, t + 0.65);
  src.connect(band).connect(hp).connect(g).connect(c.destination);
  src.start(t);
  src.stop(t + 0.7);
}
function steam(el) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const r = el.getBoundingClientRect();
  for (let i = 0; i < 9; i++) {
    const s = document.createElement('span');
    s.className = 'steam';
    const size = 24 + Math.random() * 34;
    s.style.cssText =
      `left:${r.left + r.width * (0.12 + Math.random() * 0.76)}px;top:${r.top + r.height * 0.25}px;` +
      `width:${size}px;height:${size}px;--dx:${(Math.random() - 0.5) * 60}px;--dy:${-(70 + Math.random() * 80)}px;` +
      `--dur:${950 + Math.random() * 800}ms;animation-delay:${Math.random() * 200}ms`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 2200);
  }
}

export default function PressFx() {
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);

  useEffect(() => {
    try {
      const m = localStorage.getItem('uj-sound') === 'off';
      mutedRef.current = m;
      setMuted(m);
    } catch {}

    const pressed = new Set();
    const passed = new WeakSet();
    const busy = new WeakSet();
    const target = (e) => {
      const el = e.target instanceof Element ? e.target.closest(SEL) : null;
      return el && !el.disabled && !el.closest('[data-nofx]') ? el : null;
    };

    const down = (e) => {
      const el = target(e);
      if (!el) return;
      el.classList.remove('is-pop');
      el.classList.add('is-pressed');
      pressed.add(el);
      if (!mutedRef.current) audio(); // unlock audio inside the user gesture
    };
    const up = () => {
      pressed.forEach((el) => {
        el.classList.remove('is-pressed');
        el.classList.add('is-pop');
        setTimeout(() => el.classList.remove('is-pop'), 480);
      });
      pressed.clear();
    };
    const click = (e) => {
      const el = target(e);
      if (!el) return;
      if (passed.has(el)) { passed.delete(el); return; }
      e.preventDefault();
      e.stopImmediatePropagation();
      if (busy.has(el)) return;
      busy.add(el);
      steam(el);
      if (!mutedRef.current) shhh();
      if (!el.classList.contains('is-pop')) {
        el.classList.add('is-pop');
        setTimeout(() => el.classList.remove('is-pop'), 480);
      }
      setTimeout(() => {
        busy.delete(el);
        passed.add(el);
        el.click();
      }, DELAY);
    };

    document.addEventListener('pointerdown', down, true);
    document.addEventListener('pointerup', up, true);
    document.addEventListener('pointercancel', up, true);
    document.addEventListener('click', click, true);
    return () => {
      document.removeEventListener('pointerdown', down, true);
      document.removeEventListener('pointerup', up, true);
      document.removeEventListener('pointercancel', up, true);
      document.removeEventListener('click', click, true);
    };
  }, []);

  return (
    <button
      className="fx-toggle"
      data-nofx
      aria-label={muted ? 'Turn button sound on' : 'Turn button sound off'}
      title={muted ? 'Sound off' : 'Sound on'}
      onClick={() => {
        const next = !muted;
        setMuted(next);
        mutedRef.current = next;
        try { localStorage.setItem('uj-sound', next ? 'off' : 'on'); } catch {}
      }}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
