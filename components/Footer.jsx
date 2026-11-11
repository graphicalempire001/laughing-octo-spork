import Link from 'next/link';
import { nav, site } from '@/data/site';

export default function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="container foot-grid">
        <div className="foot-brand">
          <Link href="/" className="logo" aria-label="Ubuntu & Jollof home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo-img big" src="/brand/logo.webp" alt="Ubuntu & Jollof" width="124" height="96" />
          </Link>
          <p>Smoky firewood jollof, charcoal grills and feasts worth gathering for, served with the warmth of ubuntu.</p>
        </div>
        <div>
          <h4>Pages</h4>
          <ul className="foot-links">
            {nav.map(([href, label]) => <li key={href}><Link href={href}>{label}</Link></li>)}
            <li><Link href="/order">Your order</Link></li>
          </ul>
        </div>
        <div>
          <h4>Visit &amp; Order</h4>
          <address>
            {site.addressLines.map((l) => <span key={l}>{l}<br /></span>)}
            {site.phoneDisplay}
          </address>
          <div className="foot-btns">
            <a className="btn wa sm" href={site.wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a className="btn white sm" href={`tel:${site.phoneTel}`}>Call us</a>
          </div>
        </div>
      </div>
      <div className="copyright">
        © 2026 Ubuntu &amp; Jollof. All Rights Reserved. · I am because we are.
      </div>
    </footer>
  );
}
