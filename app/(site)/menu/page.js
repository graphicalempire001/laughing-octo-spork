import Flyer from '@/components/Flyer';
import MenuSection from '@/components/MenuSection';
import Reveal from '@/components/Reveal';
import { getMenu } from '@/lib/store';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Menu — Ubuntu & Jollof', description: 'Pizza, breakfast, African plates, bakery, noodles and fast food. Budget friendly, in Rands. Order online.' };

export default async function MenuPage({ searchParams }) {
  const { cat } = await searchParams;
  const items = (await getMenu()).filter((i) => i.available !== false);
  return (
    <main>
      <section className="sec flyer-first page-top">
        <Flyer name="budget" bg="#ffffff" priority />
        <div className="container">
          <Reveal className="eyebrow">Our Menu</Reveal>
          <Reveal as="h1" className="sec-title" delay={0.1}>Everything <em>we’re cooking.</em></Reveal>
          <Reveal as="p" anim="fadeIn" className="sec-sub" delay={0.2}>Tap “+ Add” on what you want. Your order list sits in the bag at the top of the page. Prices in Rands.</Reveal>
          <MenuSection items={items} initialCat={typeof cat === 'string' ? cat : 'All'} />
        </div>
      </section>
    </main>
  );
}
