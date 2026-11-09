import PageBanner from '@/components/PageBanner';
import { LocationBlock } from '@/components/Blocks';
import Link from 'next/link';
import { site } from '@/data/site';

export const metadata = { title: 'Contact — Ubuntu & Jollof', description: 'Find Ubuntu & Jollof at 4 Paris Avenue, Bordeaux, Randburg. Call or WhatsApp +27 71 064 0654.' };

export default function ContactPage() {
  return (
    <main>
      <PageBanner eyebrow="Contact" title="Come say" em="hello." text="Call, WhatsApp or drop by. We’re happy to help with orders and questions." />
      <LocationBlock />
      <section className="strip">
        <div className="container">
          <div><h2>Ready to <em>order?</em></h2><p>Build your order online and send it straight to {site.phoneDisplay}.</p></div>
          <div className="strip-btns">
            <Link className="btn" href="/menu">Browse the menu</Link>
            <Link className="btn white" href="/order">Open my order</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
