'use client';
import { useEffect, useRef, useState } from 'react';
import { promos } from '@/data/site';

// A promo flyer that is a tiny looping-free video (WebM VP9, MP4 fallback).
// - Shows a ~10-30KB WebP poster instantly; the video only downloads when the flyer is near the screen.
// - Plays and loops while in view; pauses when scrolled away (saves battery and data).
// - Data-saver or reduced-motion visitors get the finished still image and never download the video.
// - Edges feather into the page (see .flyer-img masks in globals.css), so no box shows.
export default function Flyer({ name, bg = '#fff', priority = false, className = '' }) {
  const p = promos[name];
  const shape = p.w / p.h > 1.7 ? 'f169' : 'f32';
  const ref = useRef(null);
  const vref = useRef(null);
  const [near, setNear] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const conn = navigator.connection || {};
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches || conn.saveData || /2g/.test(conn.effectiveType || '');
    if (calm) { setStill(true); return; }
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setNear(true); return; }
    const load = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); load.disconnect(); } }, { rootMargin: '600px 0px' });
    load.observe(el);
    return () => load.disconnect();
  }, []);

  useEffect(() => {
    const v = vref.current; const el = ref.current;
    if (!near || !v || !el) return;
    const play = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        v.play().catch(() => {});
      } else v.pause();
    }, { threshold: 0.35 });
    play.observe(el);
    return () => play.disconnect();
  }, [near]);

  const base = p.src;
  return (
    <div ref={ref} className={`flyer ${shape} ${className}`.trim()} style={{ '--bg': bg, '--max': p.max }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="flyer-glow" src={`${base}-end.webp`} alt="" aria-hidden="true" loading={priority ? 'eager' : 'lazy'} />
      {still ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="flyer-img" src={`${base}-end.webp`} alt={p.alt} width={p.w} height={p.h} />
      ) : (
        <video
          ref={vref}
          className="flyer-img"
          width={p.w}
          height={p.h}
          poster={`${base}-poster.webp`}
          muted
          loop
          playsInline
          preload={priority ? 'auto' : 'none'}
          autoPlay={priority}
          aria-label={p.alt}
          style={{ aspectRatio: `${p.w} / ${p.h}` }}
        >
          {(near || priority) && <source src={`${base}.webm`} type="video/webm" />}
          {(near || priority) && <source src={`${base}.mp4`} type="video/mp4" />}
        </video>
      )}
    </div>
  );
}
