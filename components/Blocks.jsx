import Link from 'next/link';
import Flyer from './Flyer';
import Reveal from './Reveal';
import { site } from '@/data/site';

export function AboutBlock({ showLink = false }) {
  return (
    <section className="sec intro" id="about">
      <div className="container intro-grid">
        <Reveal className="intro-img bx">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/menu/native-soup.webp" alt="Native soup with eba, cooked fresh at Ubuntu & Jollof" loading="lazy" />
        </Reveal>
        <div>
          <Reveal className="eyebrow">Our Story</Reveal>
          <Reveal as="h2" className="sec-title" delay={0.1}>Food that gathers <em>people.</em></Reveal>
          <Reveal as="p" anim="fadeIn" className="sec-sub" delay={0.2}>
            Ubuntu &amp; Jollof was born from a simple belief: the best meals are shared meals. Every pot is cooked fresh, every chicken is marinated overnight and grilled to order.
          </Reveal>
          <div className="points">
            {[
              ['🔥', 'Authentic Smoke & Spice', 'No shortcuts. The taste you remember from every family gathering.'],
              ['🥬', 'Fresh, Every Morning', 'Produce and chicken delivered daily and cooked the same day.'],
              ['👪', 'Built for Families', 'A kids’ play zone, generous portions and seating for the whole crew.'],
            ].map(([ico, h, p], i) => (
              <Reveal key={h} className="point" delay={0.2 + i * 0.1}>
                <div className="ico">{ico}</div>
                <div><h3>{h}</h3><p>{p}</p></div>
              </Reveal>
            ))}
          </div>
          {showLink && (
            <Reveal delay={0.5} className="inline-cta"><Link href="/about" className="btn white">More about us</Link></Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

export function LocationBlock({ showLink = false }) {
  return (
    <section className="sec location" id="location">
      <div className="container">
        <Reveal className="eyebrow">Find Us</Reveal>
        <Reveal as="h2" className="sec-title" delay={0.1}>Visit us in <em>Randburg.</em></Reveal>
        <div className="loc-grid">
          <Reveal>
            <div className="loc-card">
              <h3 className="heading">Ubuntu &amp; Jollof</h3>
              <div className="loc-row"><span className="ico">📍</span><div><small>Address</small>{site.addressLines.map((l) => <span key={l}>{l}<br /></span>)}</div></div>
              <div className="loc-row"><span className="ico">📞</span><div><small>Phone / WhatsApp</small>{site.phoneDisplay}</div></div>
              <div className="loc-row"><span className="ico">🕙</span><div><small>Hours</small>{site.hours}</div></div>
              <div className="loc-btns">
                <a className="btn" href={site.mapLink} target="_blank" rel="noopener noreferrer">Get Directions</a>
                <a className="btn wa" href={site.wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                <a className="btn white" href={`tel:${site.phoneTel}`}>Call</a>
                {showLink && <Link className="btn white" href="/contact">Contact page</Link>}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="map-card">
              <iframe title="Map to Ubuntu & Jollof, 4 Paris Avenue, Bordeaux, Randburg" src={site.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function KidsBlock({ showLink = false }) {
  return (
    <section className="sec flyer-first kids-sec" id="kids">
      <Flyer name="kids" bg="#ffffff" />
      <div className="container kids-grid">
        <div>
          <Reveal className="eyebrow">For the Little Ones</Reveal>
          <Reveal as="h2" className="sec-title" delay={0.1}>Ubuntu Corner — <em>kids’ zone.</em></Reveal>
          <Reveal as="p" anim="fadeIn" className="sec-sub" delay={0.2}>
            Dining out should be easy for everyone. Our supervised play corner keeps children busy while parents enjoy their meal in peace, free with any dine-in order.
          </Reveal>
          <Reveal as="span" anim="fadeIn" className="hours-pill" delay={0.3}>Fri – Sun &amp; holidays · 11am – 10pm</Reveal>
          <Reveal delay={0.4} className="inline-cta">
            {showLink ? <Link href="/kids" className="btn white">About the kids’ zone</Link> : <Link href="/menu" className="btn">Order for the family</Link>}
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <div className="kids-card">
            <ul>
              <li><span>🎈</span>Supervised play corner</li>
              <li><span>🧸</span>Games and toys</li>
              <li><span>🍟</span>Kid-sized portions</li>
              <li><span>🆓</span>Free with any dine-in order</li>
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
