import { KidsBlock } from '@/components/Blocks';
import { site } from '@/data/site';
import Link from 'next/link';

export const metadata = { title: 'Kids’ Zone — Ubuntu & Jollof', description: 'A supervised play corner at Ubuntu & Jollof, free with any dine-in order.' };

export default function KidsPage() {
  return (
    <main>
      <KidsBlock />
      <section className="strip">
        <div className="container">
          <div>
            <h2>Bring the <em>whole family.</em></h2>
            <p>Find us at {site.addressLines.join(', ')}.</p>
          </div>
          <div className="strip-btns">
            <Link className="btn" href="/menu">Order for the family</Link>
            <Link className="btn white" href="/contact">Get directions</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
