'use client';
import { useEffect, useRef } from 'react';

// Scroll-snap card slider with arrows, swipe, and a gentle autoplay that pauses on hover/touch.
export default function CardSlider({ children, auto = true, label = 'Cards' }) {
  const ref = useRef(null);
  const hold = useRef(false);

  const step = (dir) => {
    const el = ref.current;
    if (!el) return;
    const card = el.firstElementChild;
    const w = card ? card.getBoundingClientRect().width + 18 : 300;
    if (dir > 0 && el.scrollLeft + el.clientWidth >= el.scrollWidth - 6) el.scrollTo({ left: 0, behavior: 'smooth' });
    else if (dir < 0 && el.scrollLeft <= 4) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
    else el.scrollBy({ left: dir * w, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => { if (!hold.current && !document.hidden) step(1); }, 4800);
    return () => clearInterval(t);
  }, [auto]);

  return (
    <div
      className="cslider"
      role="region"
      aria-label={label}
      onMouseEnter={() => (hold.current = true)}
      onMouseLeave={() => (hold.current = false)}
      onTouchStart={() => (hold.current = true)}
      onTouchEnd={() => setTimeout(() => (hold.current = false), 3000)}
    >
      <div className="cslider-track" ref={ref}>{children}</div>
      <button type="button" className="s-arrow cs-arrow cs-prev" aria-label="Previous" onClick={() => step(-1)}>&#8249;</button>
      <button type="button" className="s-arrow cs-arrow cs-next" aria-label="Next" onClick={() => step(1)}>&#8250;</button>
    </div>
  );
}
