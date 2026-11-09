'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useCart } from './CartProvider';
import { nav } from '@/data/site';

function BagIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5.5 8h13l1.2 12.5H4.3L5.5 8z" /><path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  );
}

export default function Header() {
  const path = usePathname();
  const { count, bump, setOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const openRef = useRef(false);
  openRef.current = mobileOpen;

  // Smart nav: slides away while you scroll down, slides back the moment you scroll up (or reach the top).
  useEffect(() => {
    const root = document.documentElement;
    let lastY = window.scrollY, ticking = false, acc = 0;
    const set = (hide) => root.classList.toggle('nav-hidden', hide);
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY, d = y - lastY;
        lastY = y;
        if (y < 90 || openRef.current) { set(false); acc = 0; }
        else {
          acc = (d > 0) === (acc > 0) ? acc + d : d; // distance in the current direction
          if (acc > 14) set(true);
          else if (acc < -8) set(false);
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); root.classList.remove('nav-hidden'); };
  }, []);
  useEffect(() => { if (mobileOpen) document.documentElement.classList.remove('nav-hidden'); }, [mobileOpen]);

  const active = (href) => (href === '/' ? path === '/' : path.startsWith(href));

  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="logo" aria-label="Ubuntu & Jollof home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="logo-img" src="/brand/logo.webp" alt="Ubuntu & Jollof" width="62" height="48" />
        </Link>

        <nav className="nav-main" aria-label="Main">
          {nav.map(([href, label]) => (
            <Link key={href} href={href} className={`nav-link${active(href) ? ' active' : ''}`}>{label}</Link>
          ))}
        </nav>

        <div className="head-actions">
          <button type="button" className="icon-btn light cart-btn" aria-label={`Your order, ${count} ${count === 1 ? 'item' : 'items'}`} onClick={() => setOpen(true)}>
            <BagIcon />
            {count > 0 && <span key={bump} className="cart-badge">{count > 99 ? '99+' : count}</span>}
          </button>
          <Link href="/order" className="btn sm order-cta">ORDER NOW</Link>
          <button type="button" className="icon-btn light burger" aria-label="Menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen((v) => !v)}>&#9776;</button>
        </div>
      </div>
      <div className={`mobile-nav${mobileOpen ? ' open' : ''}`}>
        {nav.map(([href, label]) => (
          <Link key={href} href={href} onClick={() => setMobileOpen(false)}>{label}</Link>
        ))}
        <Link href="/order" onClick={() => setMobileOpen(false)}>Order now</Link>
      </div>
    </header>
  );
}
