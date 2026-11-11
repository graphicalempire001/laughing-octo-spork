import Flyer from '@/components/Flyer';
import MenuSection from '@/components/MenuSection';
import Reveal from '@/components/Reveal';
import { getMenu } from '@/lib/store';
import { SITE_URL, OG_IMAGE, ogImages } from '@/data/site';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Menu: Jollof, African Plates, Pizza & Bakery', description: 'Pizza, breakfast, native soup and eba, jollof, noodles, bakery and fast food in Randburg. Budget friendly, priced in Rands. Order online on WhatsApp.', alternates: { canonical: '/menu' }, openGraph: { images: ogImages, url: '/menu', title: 'Menu: Jollof, African Plates, Pizza & Bakery | Ubuntu & Jollof', description: 'Pizza, breakfast, native soup and eba, jollof, noodles, bakery and fast food in Randburg. Budget friendly, priced in Rands. Order online on WhatsApp.' }, twitter: { card: 'summary_large_image', images: [OG_IMAGE] } };

export default async function MenuPage({ searchParams }) {
  const { cat } = await searchParams;
  const items = (await getMenu()).filter((i) => i.available !== false);
  const abs = (u) => (u && u.startsWith('http') ? u : `${SITE_URL}${u || ''}`);
  const ld = {
    '@context': 'https://schema.org', '@type': 'Menu', name: 'Ubuntu & Jollof Menu', url: `${SITE_URL}/menu`, inLanguage: 'en-ZA',
    hasMenuItem: items.map((i) => ({ '@type': 'MenuItem', name: i.name, description: i.description, image: abs(i.img), menuAddOn: undefined, offers: { '@type': 'Offer', price: String(i.price), priceCurrency: 'ZAR', availability: 'https://schema.org/InStock' } })),
  };
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
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
