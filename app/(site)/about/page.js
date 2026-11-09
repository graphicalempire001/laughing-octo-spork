import Flyer from '@/components/Flyer';
import PageBanner from '@/components/PageBanner';
import Reveal from '@/components/Reveal';
import { AboutBlock } from '@/components/Blocks';
import { WhySlider } from '@/components/Slides';
import Link from 'next/link';

export const metadata = { title: 'About — Ubuntu & Jollof', description: 'The story behind Ubuntu & Jollof: shared meals, fresh cooking and chefs who care.' };

export default function AboutPage() {
  return (
    <main>
      <PageBanner eyebrow="About us" title="Meet the" em="kitchen." text="Real cooking, made fresh every day by people who love feeding people." />
      <section className="flyer-first about-flyer"><Flyer name="chef" bg="#fff" priority /></section>
      <AboutBlock />
      <section className="sec">
        <div className="container">
          <Reveal className="eyebrow">Why us</Reveal>
          <Reveal as="h2" className="sec-title" delay={0.1}>Why people <em>keep coming back.</em></Reveal>
          <WhySlider />
          <div className="center-row"><Link href="/menu" className="btn">See the menu</Link></div>
        </div>
      </section>
    </main>
  );
}
