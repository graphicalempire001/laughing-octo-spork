'use client';
import { useEffect, useRef } from 'react';

// Scroll-triggered entrance (fadeInUp / fadeInDown / slideInUp / fadeIn).
// Wrap buttons in a Reveal instead of making the button itself animated.
export default function Reveal({ as: Tag = 'div', anim = 'fadeInUp', delay = 0, className = '', style, children, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([en]) => {
        if (en.isIntersecting) {
          el.classList.add('in');
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`anim ${anim} ${className}`.trim()} style={{ '--d': `${delay}s`, ...style }} {...rest}>
      {children}
    </Tag>
  );
}
