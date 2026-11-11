import Link from 'next/link';
import { nav, site, waLink } from '@/data/site';

export const metadata = {
  title: 'Page not found',
  description: 'This page is not on the menu. Head back to Ubuntu & Jollof.',
  robots: { index: false, follow: true },
};

// Shown for every unknown address (including old or private ones), so it never hints at what exists.
export default function NotFound() {
  return (
    <main className="nf">
      <div className="nf-card">
        <div className="nf-steam" aria-hidden="true"><i /><i /><i /><i /></div>
        <Link href="/" aria-label="Ubuntu & Jollof home" className="nf-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo.webp" alt="Ubuntu & Jollof" width="150" height="116" />
        </Link>
        <p className="eyebrow nf-eyebrow">Error 404</p>
        <div className="nf-code" aria-hidden="true"><span>4</span><span className="nf-bowl">🍛</span><span>4</span></div>
        <h1 className="nf-title">This plate isn’t <em>on the menu.</em></h1>
        <p className="nf-text">The page you’re looking for has moved or never existed. Let’s get you back to the good stuff.</p>
        <div className="nf-cta">
          <Link href="/" className="btn">Back to the main site</Link>
          <Link href="/menu" className="btn dark">See the menu</Link>
        </div>
        <nav className="nf-links" aria-label="Pages">
          {nav.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <p className="nf-help">Need a hand? <a href={waLink('Hi Ubuntu & Jollof, I need some help.')} target="_blank" rel="noopener noreferrer">WhatsApp us</a> or call <a href={`tel:${site.phoneTel}`}>{site.phoneDisplay}</a></p>
      </div>
    </main>
  );
}
