import Link from 'next/link';
import Hero from '@/components/Hero';
import Flyer from '@/components/Flyer';
import Reveal from '@/components/Reveal';
import MenuSection from '@/components/MenuSection';
import { AboutBlock, KidsBlock, LocationBlock } from '@/components/Blocks';
import { CategorySlider, StepsSlider } from '@/components/Slides';
import { site } from '@/data/site';
import { getMenu } from '@/lib/store';

export const dynamic = 'force-dynamic'; // menu edits in /admin show up immediately

export default async function Home() {
  const items = (await getMenu()).filter((i) => i.available !== false);

  return (
    <main>
      {/* The hero stays put; everything below climbs over it like a card. */}
      <Hero />
      <div className="rise">
        <section className="chef-card" aria-label="Our chefs">
          <Flyer name="chef" bg="#fff4cf" priority />
          <div className="card-cta">
            <Link href="/menu" className="btn">See what’s cooking</Link>
            <Link href="/order" className="btn dark">Order now</Link>
          </div>
        </section>

        <section className="sec cream">
          <div className="container">
            <Reveal className="eyebrow">Browse</Reveal>
            <Reveal as="h2" className="sec-title" delay={0.1}>What are you in the <em>mood for?</em></Reveal>
            <CategorySlider />
          </div>
        </section>

        <section className="sec flyer-first" id="menu">
          <Flyer name="budget" bg="#ffffff" />
          <div className="container">
            <div className="menu-head">
              <div>
                <Reveal className="eyebrow">The Menu</Reveal>
                <Reveal as="h2" className="sec-title" delay={0.1}>Signature <em>plates.</em></Reveal>
                <Reveal as="p" anim="fadeIn" className="sec-sub" delay={0.2}>Tap “+ Add” on what you want and it goes into your order list. Prices in Rands.</Reveal>
              </div>
            </div>
            <MenuSection items={items} limit={8} />
          </div>
        </section>

        <section className="sec flyer-first order-sec" id="order">
          <Flyer name="delivery" bg="#fff4cf" />
          <div className="container">
            <Reveal className="eyebrow">Make your order</Reveal>
            <Reveal as="h2" className="sec-title" delay={0.1}>Easiest way to <em>order.</em></Reveal>
            <StepsSlider />
            <div className="center-row row-gap">
              <Link href="/order" className="btn">Open my order</Link>
              <a className="btn wa" href={site.wa} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
              <a className="btn white" href={`tel:${site.phoneTel}`}>Call {site.phoneDisplay}</a>
            </div>
          </div>
        </section>

        <AboutBlock showLink />
        <LocationBlock showLink />
        <KidsBlock showLink />
      </div>
    </main>
  );
}
