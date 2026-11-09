import Link from 'next/link';
import CardSlider from './CardSlider';
import { categoryCovers, steps, why } from '@/data/site';

export function CategorySlider() {
  return (
    <CardSlider label="Browse by category">
      {categoryCovers.map((c) => (
        <Link key={c.cat} href={`/menu?cat=${encodeURIComponent(c.cat)}`} className="slide-card cat-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.img} alt="" loading="lazy" />
          <div className="cat-card-body"><h3>{c.cat}</h3><p>{c.blurb}</p><span>See dishes →</span></div>
        </Link>
      ))}
    </CardSlider>
  );
}

export function StepsSlider() {
  return (
    <CardSlider label="How ordering works">
      {steps.map((s) => (
        <div key={s.n} className="slide-card step-card">
          <div className="step-top"><span className="step-n">{s.n}</span><span className="step-ico">{s.ico}</span></div>
          <h3>{s.title}</h3>
          <p>{s.text}</p>
        </div>
      ))}
    </CardSlider>
  );
}

export function WhySlider() {
  return (
    <CardSlider label="Why Ubuntu & Jollof">
      {why.map((w) => (
        <div key={w.title} className="slide-card why-card">
          <div className="why-ico">{w.ico}</div>
          <h3>{w.title}</h3>
          <p>{w.text}</p>
        </div>
      ))}
    </CardSlider>
  );
}
