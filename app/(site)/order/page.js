import Flyer from '@/components/Flyer';
import OrderForm from '@/components/OrderForm';
import Reveal from '@/components/Reveal';

export const metadata = { title: 'Your order — Ubuntu & Jollof', description: 'Review your order and send it to Ubuntu & Jollof on WhatsApp.' };

export default function OrderPage() {
  return (
    <main>
      <section className="sec flyer-first page-top order-sec">
        <Flyer name="delivery" bg="#fff4cf" priority />
        <div className="container">
          <Reveal className="eyebrow">Checkout</Reveal>
          <Reveal as="h1" className="sec-title" delay={0.1}>Your <em>order.</em></Reveal>
          <Reveal as="p" anim="fadeIn" className="sec-sub" delay={0.2}>Check your items, add your details and send it to us on WhatsApp.</Reveal>
          <div className="order-wrap"><OrderForm /></div>
        </div>
      </section>
    </main>
  );
}
